// --- Render the printable Duke Energy paper bill ---
(function () {
  const username = sessionStorage.getItem("te_user");
  const accounts = window.TE_ACCOUNTS || {};
  const acct = username ? accounts[username] : null;
  if (!acct) { window.location.replace("index.html"); return; }

  const money = (n) =>
    "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  // Split address into street + city/state/zip
  const parts = acct.serviceAddress.split(",");
  const street = parts.slice(0, parts.length - 2).join(",").trim();
  const cityState = parts.slice(parts.length - 2).join(",").trim();
  // Joint account holders are stacked on separate lines (Duke-style)
  const names = acct.name2 ? [acct.name, acct.name2] : [acct.name];
  const nameHtml = names.map((n) => n.toUpperCase()).join("<br>");
  const setHtml = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

  // ---- Masthead ----
  setHtml("bName", nameHtml);
  set("bAddr1", street.toUpperCase());
  set("bAddr2", cityState.toUpperCase());
  set("bBillDate", acct.billDate);
  set("bService", acct.serviceFrom + " - " + acct.serviceTo);
  set("bDays", acct.days + " days");
  set("bAcct", acct.accountNumber);

  // ---- Billing summary ----
  const sum = document.getElementById("bSummary");
  const rows = [
    ["Previous Amount Due", money(acct.previousBalance), ""],
    ["Payment Received " + acct.paymentDate, "-" + money(acct.paymentReceived), "indent"],
    ["Current Electric Charges", money(acct.currentElectric), ""],
    ["Current Lighting Charges", money(acct.currentLighting), ""],
    ["Taxes", money(acct.taxes), ""]
  ];
  sum.innerHTML = rows.map((r) =>
    '<tr class="' + r[2] + '"><td>' + r[0] + '</td><td class="num">' + r[1] + '</td></tr>'
  ).join("") +
    '<tr class="total"><td>Total Amount Due ' + acct.dueDateShort + '</td><td class="num">' + money(acct.totalDue) + '</td></tr>';

  // ---- Usage line chart ----
  const data = acct.usage;
  const W = 560, H = 200, padL = 44, padR = 16, padT = 12, padB = 26;
  const maxY = 2730;
  const yTicks = [0, 303, 607, 910, 1214, 1517, 1820, 2124, 2427, 2730];
  const x = (i) => padL + (i * (W - padL - padR)) / (data.length - 1);
  const y = (k) => padT + (H - padT - padB) * (1 - k / maxY);

  let svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="bill-chart__svg" xmlns="http://www.w3.org/2000/svg">';
  // y gridlines + labels
  yTicks.forEach((t) => {
    svg += '<line x1="' + padL + '" y1="' + y(t) + '" x2="' + (W - padR) + '" y2="' + y(t) + '" stroke="#e3e7ea" stroke-width="1"/>';
    svg += '<text x="' + (padL - 6) + '" y="' + (y(t) + 3) + '" text-anchor="end" font-size="7" fill="#7a8288">' + t + '</text>';
  });
  // split into prev (blue) and cur (green) polylines; share the boundary point
  const pts = data.map((d, i) => ({ x: x(i), y: y(d.k), seg: d.y, m: d.m }));
  const boundary = pts.findIndex((p) => p.seg === "cur");
  const prevLine = pts.slice(0, boundary < 0 ? pts.length : boundary + 1);
  const curLine = boundary < 0 ? [] : pts.slice(boundary - 1 < 0 ? 0 : boundary - 1);
  const toPoly = (arr) => arr.map((p) => p.x.toFixed(1) + "," + p.y.toFixed(1)).join(" ");
  if (prevLine.length) svg += '<polyline points="' + toPoly(prevLine) + '" fill="none" stroke="#0a6ca6" stroke-width="2"/>';
  if (curLine.length) svg += '<polyline points="' + toPoly(curLine) + '" fill="none" stroke="#54b948" stroke-width="2"/>';
  // x labels
  pts.forEach((p) => {
    svg += '<text x="' + p.x.toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="7" fill="#7a8288">' + p.m + '</text>';
  });
  // year labels
  const prevYr = (parseInt(acct.serviceYear, 10) - 1);
  svg += '<text x="' + x(1) + '" y="' + (padT + 4) + '" font-size="9" font-weight="700" fill="#0a6ca6">' + prevYr + '</text>';
  svg += '<text x="' + x(data.length - 2) + '" y="' + (padT + 4) + '" font-size="9" font-weight="700" fill="#54b948" text-anchor="end">' + acct.serviceYear + '</text>';
  svg += '<text x="' + (W / 2) + '" y="' + (padT + 2) + '" text-anchor="middle" font-size="8" fill="#3f464d">kWh</text>';
  svg += "</svg>";
  document.getElementById("bChart").innerHTML = svg;

  // ---- Temperature row (aligns under chart months) ----
  const temps = acct.temps || [];
  document.getElementById("bTemps").innerHTML =
    data.map((d, i) => '<span>' + (temps[i] != null ? temps[i] + "°" : "") + '</span>').join("");

  // ---- Usage table ----
  const prevYrLabel = data[0] ? data[0].m + " " + prevYr : "Last Year";
  set("bLastYearHd", prevYrLabel);
  set("bCurMonth", acct.currentMonthKwh.toLocaleString());
  set("bLastYear", acct.lastYearMonthKwh.toLocaleString());
  set("b12mo", acct.twelveMonthUsage);
  set("bAvg", acct.avgMonthlyUsage.toLocaleString());

  // ---- Payment stub ----
  setHtml("bStubName", nameHtml);
  set("bStubAddr1", street.toUpperCase());
  set("bStubAddr2", (acct.mailingAddress.split(",").slice(-2).join(",").trim() || cityState).toUpperCase());
  set("bStubAcct", acct.accountNumber);
  set("bStubAmt", money(acct.totalDue));
  set("bStubDue", acct.dueDateShort);
  set("bStubDue2", acct.dueDateShort);

  // ---- Barcode (decorative) ----
  const digits = (acct.accountNumber.replace(/\s/g, "") + "0000550000000000000000003106400000" + Math.round(acct.totalDue * 100));
  let bars = "";
  for (let i = 0; i < 95; i++) {
    const w = (i % 7 === 0 || i % 3 === 0) ? 3 : (i % 2 === 0 ? 1 : 2);
    bars += '<span style="width:' + w + 'px"></span>';
  }
  document.getElementById("bBarcode").innerHTML =
    '<div class="bill-barcode__bars">' + bars + '</div>' +
    '<div class="bill-barcode__num">' + digits.split("").join(" ") + '</div>';

  // ---- Print ----
  const printBtn = document.getElementById("printBtn");
  if (printBtn) printBtn.addEventListener("click", () => window.print());
})();
