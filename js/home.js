/* ============================================================
   Thoth & Son — Home interactions
   HUD + crosshair vêm de instruments.js (carregado globalmente)
   ============================================================ */
(function () {
  'use strict';

  // ── Hero title letter-by-letter reveal ─────────────────────
  const title = document.querySelector('.hero-title');
  if (title && !title.dataset.split) {
    const words = title.textContent.trim().split(/\s+/);
    title.textContent = '';
    words.forEach((word, wi) => {
      const wordEl = document.createElement('span');
      wordEl.className = 'word';
      [...word].forEach((ch, ci) => {
        const c = document.createElement('span');
        c.className = 'char';
        c.textContent = ch;
        const delay = 0.4 + (wi * word.length + ci) * 0.05;
        c.style.animationDelay = delay + 's';
        wordEl.appendChild(c);
      });
      title.appendChild(wordEl);
    });
    title.dataset.split = 'true';
  }

  // ── Reveal on scroll (pilares) ──────────────────────────────
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    document.querySelectorAll('.pillar').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.12) + 's';
      io.observe(el);
    });
  } else {
    document.querySelectorAll('.pillar').forEach((el) => el.classList.add('visible'));
  }

  // ── Hero-active class on body ───────────────────────────────
  const heroSection = document.querySelector('.hero');
  if (heroSection && 'IntersectionObserver' in window) {
    const heroIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        document.body.classList.toggle(
          'hero-active',
          entry.isIntersecting && entry.intersectionRatio > 0.4
        );
      });
    }, { threshold: [0, 0.4, 1] });
    heroIO.observe(heroSection);
  }
})();
