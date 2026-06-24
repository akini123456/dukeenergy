// =============================================================
//  FAKE ACCOUNTS + BILLS  (educational demo only — not real)
//  To add a login: copy a block and edit. Passwords are plain
//  text on purpose so it's easy to demo; never do this for real.
// =============================================================
window.TE_ACCOUNTS = {
  // username (lowercase) : { ...account data }
  "arshleenkaur": {
    password: "123456",
    name: "Arshleen Kaur",
    name2: "Harasees Singh",
    accountNumber: "9100 9029 1504",
    serviceAddress: "8884 Bengal Ct, Kissimmee, FL 33706",
    mailingAddress: "8884 Bengal Ct, Kissimmee, FL 33706-6206",
    ratePlan: "Residential Service (RS-1)",

    // Bill header
    billDate: "Jun 25, 2026",
    serviceFrom: "May 22",
    serviceTo: "June 21",
    serviceYear: "2026",
    days: 30,
    dueDate: "Aug 19, 2026",
    dueDateShort: "Aug 19",

    // Billing summary
    previousBalance: 195.28,
    paymentReceived: 195.28,
    paymentDate: "Jul 22",
    currentElectric: 287.05,
    currentLighting: 3.27,
    taxes: 20.32,
    amountDue: 310.64,
    totalDue: 310.64,

    // Account flags
    autopay: true,
    paperless: true,
    pickDueDate: false,

    // Usage snapshot
    currentMonthKwh: 2427,
    lastYearMonthKwh: 0,
    twelveMonthUsage: "N/A",
    avgMonthlyUsage: 1182,
    // 13-month electric usage history (Jul prior year -> Jul current)
    usage: [
      { m: "Jul", k: 910,  y: "prev" }, { m: "Aug", k: 1214, y: "prev" },
      { m: "Sep", k: 1517, y: "prev" }, { m: "Oct", k: 1700, y: "prev" },
      { m: "Nov", k: 1820, y: "prev" }, { m: "Dec", k: 1120, y: "prev" },
      { m: "Jan", k: 720,  y: "cur" },  { m: "Feb", k: 607,  y: "cur" },
      { m: "Mar", k: 760,  y: "cur" },  { m: "Apr", k: 1040, y: "cur" },
      { m: "May", k: 1560, y: "cur" },  { m: "Jun", k: 2124, y: "cur" },
      { m: "Jul", k: 2427, y: "cur" }
    ],
    temps: [79,79,72,65,49,51,39,47,55,61,70,77,79]
  },

  "manavvohra": {
    password: "123456",
    name: "Manav Vohra",
    name2: "Siddharth Vohra",
    accountNumber: "9100 6632 1175",
    serviceAddress: "310 79th Ave, Unit 1, St Pete Beach, FL 33706",
    mailingAddress: "310 79th Ave, Unit 1, St Pete Beach, FL 33706",
    ratePlan: "Residential Service (RS-1)",
    billDate: "Jun 25, 2026",
    serviceFrom: "May 22",
    serviceTo: "June 21",
    serviceYear: "2026",
    days: 30,
    dueDate: "Aug 19, 2026",
    dueDateShort: "Aug 19",
    previousBalance: 168.93,
    paymentReceived: 168.93,
    paymentDate: "Jul 22",
    currentElectric: 152.40,
    currentLighting: 3.27,
    taxes: 13.26,
    amountDue: 168.93,
    totalDue: 168.93,
    autopay: false,
    paperless: true,
    pickDueDate: false,
    currentMonthKwh: 1395,
    lastYearMonthKwh: 1280,
    twelveMonthUsage: "15,280",
    avgMonthlyUsage: 1273,
    usage: [
      { m: "Jul", k: 1180, y: "prev" }, { m: "Aug", k: 1320, y: "prev" },
      { m: "Sep", k: 1410, y: "prev" }, { m: "Oct", k: 1290, y: "prev" },
      { m: "Nov", k: 1010, y: "prev" }, { m: "Dec", k: 880,  y: "prev" },
      { m: "Jan", k: 820,  y: "cur" },  { m: "Feb", k: 790,  y: "cur" },
      { m: "Mar", k: 970,  y: "cur" },  { m: "Apr", k: 1110, y: "cur" },
      { m: "May", k: 1255, y: "cur" },  { m: "Jun", k: 1340, y: "cur" },
      { m: "Jul", k: 1395, y: "cur" }
    ],
    temps: [79,79,72,65,49,51,39,47,55,61,70,77,79]
  },

  "ishanarora": {
    password: "123456",
    name: "Ishan Arora",
    name2: "Anish Arora",
    accountNumber: "9100 6632 1183",
    serviceAddress: "310 79th Ave, Unit 2, St Pete Beach, FL 33706",
    mailingAddress: "310 79th Ave, Unit 2, St Pete Beach, FL 33706",
    ratePlan: "Residential Service (RS-1)",
    billDate: "Jun 25, 2026",
    serviceFrom: "May 22",
    serviceTo: "June 21",
    serviceYear: "2026",
    days: 30,
    dueDate: "Aug 19, 2026",
    dueDateShort: "Aug 19",
    previousBalance: 117.42,
    paymentReceived: 117.42,
    paymentDate: "Jul 22",
    currentElectric: 103.40,
    currentLighting: 3.27,
    taxes: 10.75,
    amountDue: 117.42,
    totalDue: 117.42,
    autopay: false,
    paperless: false,
    pickDueDate: true,
    currentMonthKwh: 965,
    lastYearMonthKwh: 1010,
    twelveMonthUsage: "9,840",
    avgMonthlyUsage: 820,
    usage: [
      { m: "Jul", k: 1010, y: "prev" }, { m: "Aug", k: 980,  y: "prev" },
      { m: "Sep", k: 940,  y: "prev" }, { m: "Oct", k: 870,  y: "prev" },
      { m: "Nov", k: 700,  y: "prev" }, { m: "Dec", k: 650,  y: "prev" },
      { m: "Jan", k: 690,  y: "cur" },  { m: "Feb", k: 640,  y: "cur" },
      { m: "Mar", k: 720,  y: "cur" },  { m: "Apr", k: 815,  y: "cur" },
      { m: "May", k: 900,  y: "cur" },  { m: "Jun", k: 945,  y: "cur" },
      { m: "Jul", k: 965,  y: "cur" }
    ],
    temps: [79,79,72,65,49,51,39,47,55,61,70,77,79]
  },

  "piakini": {
    password: "123456",
    name: "Pia Kini",
    name2: "Aryan Vohra",
    accountNumber: "9100 7745 2092",
    serviceAddress: "410 73rd Ave, St Pete Beach, FL 33706",
    mailingAddress: "410 73rd Ave, St Pete Beach, FL 33706",
    ratePlan: "Residential Service (RS-1)",
    billDate: "Jun 25, 2026",
    serviceFrom: "May 22",
    serviceTo: "June 21",
    serviceYear: "2026",
    days: 30,
    dueDate: "Aug 19, 2026",
    dueDateShort: "Aug 19",
    previousBalance: 156.40,
    paymentReceived: 156.40,
    paymentDate: "Jul 22",
    currentElectric: 178.40,
    currentLighting: 3.27,
    taxes: 21.51,
    amountDue: 203.18,
    totalDue: 203.18,
    autopay: true,
    paperless: true,
    pickDueDate: false,
    currentMonthKwh: 1685,
    lastYearMonthKwh: 1520,
    twelveMonthUsage: "13,920",
    avgMonthlyUsage: 1160,
    usage: [
      { m: "Jul", k: 1320, y: "prev" }, { m: "Aug", k: 1450, y: "prev" },
      { m: "Sep", k: 1510, y: "prev" }, { m: "Oct", k: 1360, y: "prev" },
      { m: "Nov", k: 1050, y: "prev" }, { m: "Dec", k: 900,  y: "prev" },
      { m: "Jan", k: 840,  y: "cur" },  { m: "Feb", k: 800,  y: "cur" },
      { m: "Mar", k: 980,  y: "cur" },  { m: "Apr", k: 1180, y: "cur" },
      { m: "May", k: 1420, y: "cur" },  { m: "Jun", k: 1590, y: "cur" },
      { m: "Jul", k: 1685, y: "cur" }
    ],
    temps: [79,79,72,65,49,51,39,47,55,61,70,77,79]
  }
};
