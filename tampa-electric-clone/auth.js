// --- Login modal + fake auth (educational demo only) ---
(function () {
  const modal = document.getElementById("loginModal");
  const openBtn = document.getElementById("signInBtn");
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("loginError");

  if (!modal) return;

  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.getElementById("username").focus();
  }
  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (errorMsg) errorMsg.hidden = true;
  }

  // Any element that should open the login modal
  document
    .querySelectorAll("#signInBtn, #signInBtn2, #payCard")
    .forEach((el) => el.addEventListener("click", openModal));
  void openBtn;
  modal.querySelectorAll("[data-close]").forEach((el) =>
    el.addEventListener("click", closeModal)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("username").value.trim().toLowerCase();
    const pass = document.getElementById("password").value;
    const accounts = window.TE_ACCOUNTS || {};
    const match = accounts[user];

    if (match && match.password === pass) {
      sessionStorage.setItem("te_user", user);
      window.location.href = "dashboard.html";
    } else {
      errorMsg.hidden = false;
    }
  });
})();
