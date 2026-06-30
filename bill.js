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
  // One name only — whoever's login is being used
  const nameHtml = acct.name.toUpperCase();
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
  // Autopay accounts show "Amount of automatic draft"; others show "Amount due" + late-charge note
  if (acct.autopay) {
    set("bStubDueHd", "Amount of automatic draft");
    setHtml("bStubNote", "<em>Your payment is scheduled to be made by monthly automatic draft on " + acct.dueDateShort + ".</em>");
  } else {
    set("bStubDueHd", "Amount due");
    setHtml("bStubNote", "<em>After " + acct.dueDateShort + ", a late charge will apply.</em>");
  }

  // ---- Bottom scan line (numbers only, Courier — no barcode) ----
  const digits = (acct.accountNumber.replace(/\s/g, "") + "0000550000000000000000003106400000" + Math.round(acct.totalDue * 100));
  document.getElementById("bBarcode").innerHTML =
    '<div class="bill-barcode__num">' + digits + '</div>';

  // ---- Pages 2 & 3 ----
  // Date helpers so all sub-periods stay consistent with this account's service dates
  const MONTHS = { jan:["Jan",31], feb:["Feb",28], mar:["Mar",31], apr:["Apr",30],
    may:["May",31], jun:["Jun",30], jul:["Jul",31], aug:["Aug",31],
    sep:["Sep",30], oct:["Oct",31], nov:["Nov",30], dec:["Dec",31] };
  const ORDER = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
  const parseMD = (s) => {
    const bits = String(s).trim().split(/\s+/);
    const key = bits[0].slice(0, 3).toLowerCase();
    return { key: key, abbr: (MONTHS[key] || ["", 30])[0], last: (MONTHS[key] || ["", 30])[1], day: parseInt(bits[1], 10) || 1 };
  };
  const nextAbbr = (key) => MONTHS[ORDER[(ORDER.indexOf(key) + 1) % 12]][0];

  const from = parseMD(acct.serviceFrom);
  const to = parseMD(acct.serviceTo);
  const periodFull = from.abbr + " " + from.day + " to " + to.abbr + " " + to.day;
  const periodDash = from.abbr + " " + from.day + " - " + to.abbr + " " + to.day;
  const sub1 = from.abbr + " " + from.day + " to " + from.abbr + " " + from.last;
  const sub2 = nextAbbr(from.key) + " 01 to " + to.abbr + " " + to.day;
  const days1 = Math.max(1, from.last - from.day + 1);
  const days2 = Math.max(1, to.day);

  set("p2Acct", acct.accountNumber);
  set("p3Acct", acct.accountNumber);
  set("p2NextRead", nextAbbr(to.key) + " " + to.day);

  // Meter usage snapshot
  const kWh = acct.currentMonthKwh;
  const prevRead = acct.meterPrev || 1000;
  const actualRead = prevRead + kWh;
  const meter = acct.meterNumber || "336269538";
  const num = (n) => Number(n).toLocaleString("en-US");
  set("p3Meter", meter);
  set("p3ElecMeter", meter);
  set("p3ActLabel", to.abbr + " " + to.day);
  set("p3PrevLabel", from.abbr + " " + from.day);
  set("p3Actual", num(actualRead));
  set("p3Prev", "- " + num(prevRead));
  set("p3Used", num(kWh) + " kWh");
  set("p3Billed", num(kWh) + ".000 kWh");
  set("p3SLPeriod", periodDash);
  set("p3LightPeriod", periodFull);
  set("p3ElecPeriod", periodFull);

  // Taxes
  set("p3Tax", money(acct.taxes));
  set("p3TaxTotal", money(acct.taxes));

  const amt = (n) => Number(n).toFixed(2);
  const rate8 = (n) => "$" + Number(n).toFixed(8);
  const liRow = (d, v, cls) => '<div class="bill-li ' + (cls || "") + '"><span>' + d + "</span><span>" + (v || "") + "</span></div>";

  // Lighting breakdown (sums to currentLighting; fixture $3.25 + small storm recovery)
  const lightStorm = Math.round((acct.currentLighting - 3.25) * 100) / 100;
  const ls1 = Math.round(lightStorm * 0.5 * 100) / 100;
  const ls2 = Math.round((lightStorm - ls1) * 100) / 100;
  document.getElementById("p3LightRows").innerHTML =
    liRow("Storm Recovery Cost - " + sub1, "") +
    liRow("13.800 kWh @ $0.00045000", "$" + amt(ls1), "bill-li--sub") +
    liRow("Storm Recovery Cost - " + sub2, "") +
    liRow("32.200 kWh @ $0.00034000", amt(ls2), "bill-li--sub") +
    liRow("Fixture Charge", "") +
    liRow("SV 95HL UG WP5", "", "bill-li--sub") +
    liRow("1.000 @ $3.25000000", "3.25", "bill-li--sub") +
    liRow("Total Current Charges", money(acct.currentLighting), "bill-li--total");

  // Electric breakdown (computed so the line items sum to currentElectric)
  const basic = 14.0;
  const renewable = 1.41;
  const remaining = Math.round((acct.currentElectric - basic - renewable) * 100) / 100;
  const stormElec = Math.round(remaining * 0.0205 * 100) / 100;
  const energyCharge = Math.round((remaining - stormElec) * 100) / 100;
  const energyRate = energyCharge / kWh;
  const storm1 = Math.round(stormElec * (days1 / (days1 + days2)) * 100) / 100;
  const storm2 = Math.round((stormElec - storm1) * 100) / 100;
  const kWh1 = Math.round(kWh * days1 / (days1 + days2));
  const kWh2 = kWh - kWh1;
  document.getElementById("p3ElecRows").innerHTML =
    liRow("Basic Customer Charge", "$" + amt(basic)) +
    liRow("Energy Charge", "") +
    liRow(num(kWh) + ".000 kWh @ " + rate8(energyRate), amt(energyCharge), "bill-li--sub") +
    liRow("Storm Recovery Cost - " + sub1, "") +
    liRow(num(kWh1) + ".000 kWh @ " + rate8(storm1 / kWh1), amt(storm1), "bill-li--sub") +
    liRow("Storm Recovery Cost - " + sub2, "") +
    liRow(num(kWh2) + ".000 kWh @ " + rate8(storm2 / kWh2), amt(storm2), "bill-li--sub") +
    liRow("Renewable Energy Rider", amt(renewable)) +
    liRow("Total Current Charges", money(acct.currentElectric), "bill-li--total");

  // ---- Print ----
  const printBtn = document.getElementById("printBtn");
  if (printBtn) printBtn.addEventListener("click", () => window.print());

  // ---- Mobile: scale the whole bill to fit the screen like a PDF page ----
  function fitBill() {
    const scaler = document.querySelector(".billscaler");
    const sheet = document.querySelector(".billsheet");
    if (!scaler || !sheet) return;
    const sheetW = 820;
    const avail = document.documentElement.clientWidth;
    if (avail < sheetW) {
      const scale = avail / sheetW;
      sheet.style.transform = "scale(" + scale + ")";
      scaler.style.height = sheet.offsetHeight * scale + "px";
    } else {
      sheet.style.transform = "";
      scaler.style.height = "";
    }
  }
  fitBill();
  window.addEventListener("resize", fitBill);
  window.addEventListener("load", fitBill);
})();
