// --- Render the logged-in "My Account" dashboard ---
(function () {
  const username = sessionStorage.getItem("te_user");
  const accounts = window.TE_ACCOUNTS || {};
  const acct = username ? accounts[username] : null;

  // Not logged in -> bounce to home
  if (!acct) {
    window.location.replace("index.html");
    return;
  }

  const money = (n) =>
    "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  const firstName = acct.name.split(" ")[0];
  set("greeting", "Hi, " + firstName + "!");
  set("acctNo", "Account #" + acct.accountNumber.replace(/\s/g, ""));

  // Summary
  set("amountDue", money(acct.amountDue));
  set("dueDate", acct.dueDate);

  // Billing cycle comparison subtitle
  const last = acct.usage[acct.usage.length - 1];
  const prevSame = acct.usage.find((d) => d.m === last.m && d.y === "prev");
  if (prevSame) {
    const diff = last.k - prevSame.k;
    const pct = Math.round((Math.abs(diff) / prevSame.k) * 100);
    set("usageSub",
      last.k.toLocaleString() + " kWh this cycle  •  " +
      (diff >= 0 ? "▲ " + pct + "% more" : "▼ " + pct + "% less") + " vs. last year");
  } else {
    set("usageSub", last.k.toLocaleString() + " kWh this cycle");
  }

  // Usage chart (last 7 months)
  const chart = document.getElementById("usageChart");
  if (chart) {
    const recent = acct.usage.slice(-7);
    const max = Math.max(...recent.map((d) => d.k));
    recent.forEach((d, i) => {
      const col = document.createElement("div");
      col.className = "acompare__col" + (i === recent.length - 1 ? " is-current" : "");
      col.innerHTML =
        '<span class="acompare__bar" style="height:' + Math.round((d.k / max) * 100) + '%"></span>' +
        '<span class="acompare__lbl">' + d.m + "</span>";
      chart.appendChild(col);
    });
  }

  // Enrollment list (Auto Pay / Paperless / Pick Your Due Date)
  const yes = '<svg class="enroll__y" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M10.2 15.3 7 12.1l1.2-1.2 2 2 4.6-4.6L16 9.5z" fill="#fff"/></svg>';
  const no = '<svg class="enroll__n" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M15.5 9.5 13 12l2.5 2.5-1 1L12 13l-2.5 2.5-1-1L11 12 8.5 9.5l1-1L12 11l2.5-2.5z" fill="#fff"/></svg>';
  const chev = '<svg class="enroll__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
  const rows = [
    { label: "Auto Pay", on: acct.autopay },
    { label: "Paperless Billing", on: acct.paperless },
    { label: "Pick Your Due Date", on: acct.pickDueDate }
  ];
  const enrollList = document.getElementById("enrollList");
  if (enrollList) {
    enrollList.innerHTML = rows.map((r) =>
      '<li><a href="#"><span class="enroll__label">' + r.label + '</span>' +
      '<span class="enroll__state ' + (r.on ? "is-on" : "is-off") + '">' +
      (r.on ? yes + "Enrolled" : no + "Not Enrolled") + '</span>' + chev + '</a></li>'
    ).join("");
  }

  // Pay button
  const payBtn = document.getElementById("payBtn");
  if (payBtn) {
    payBtn.addEventListener("click", () => {
      document.getElementById("paidMsg").hidden = false;
      payBtn.disabled = true;
      payBtn.textContent = "Payment Scheduled";
    });
  }

  // Sign out
  const signOut = document.getElementById("signOutBtn");
  if (signOut) {
    signOut.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.removeItem("te_user");
      window.location.href = "index.html";
    });
  }
})();
