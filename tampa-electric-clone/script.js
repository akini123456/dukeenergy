// --- Hero carousel (only on pages that have one) ---
(function () {
  const slides = Array.from(document.querySelectorAll('.hero__slide'));
  const dotsWrap = document.querySelector('.hero__dots');
  if (!slides.length || !dotsWrap) return;
  let index = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => go(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function go(i) {
    slides[index].classList.remove('is-active');
    dots[index].classList.remove('is-active');
    index = (i + slides.length) % slides.length;
    slides[index].classList.add('is-active');
    dots[index].classList.add('is-active');
    restart();
  }
  function restart() {
    clearInterval(timer);
    timer = setInterval(() => go(index + 1), 6000);
  }

  document.querySelector('.hero__arrow--next').addEventListener('click', () => go(index + 1));
  document.querySelector('.hero__arrow--prev').addEventListener('click', () => go(index - 1));
  restart();
})();

// --- Slide-out navigation drawer (Duke skin) ---
(function () {
  const burger = document.getElementById('navBurger');
  const drawer = document.getElementById('navDrawer');
  if (burger && drawer) {
    const open = () => {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };
    burger.addEventListener('click', open);
    drawer.querySelectorAll('[data-navclose]').forEach((el) =>
      el.addEventListener('click', close)
    );
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
    });
    return;
  }

  // Fallback: old Tampa Electric mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const header = document.querySelector('.header');
  if (!toggle || !header) return;
  toggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen);
  });
})();
