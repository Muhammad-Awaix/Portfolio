/* ═══════════════════════════════════════════════
   ANIMATIONS.JS — Scroll Reveal · Tilt · Counter
═══════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initTiltEffect();
  initStatCounter();
});

/* ─── SCROLL REVEAL (IntersectionObserver) ─── */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right'
  );

  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // Unobserve after reveal to save performance
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  revealElements.forEach(el => {
    // Don't observe hero elements (they use CSS animation)
    if (!el.closest('.hero')) {
      observer.observe(el);
    } else {
      el.classList.add('in-view');
    }
  });
}

/* ─── 3D TILT EFFECT ─── */
function initTiltEffect() {
  const cards = document.querySelectorAll('[data-tilt]');
  if (!cards.length) return;

  // Only on non-touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  cards.forEach(card => {
    let bounds;

    function getMousePosition(e) {
      bounds = card.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;
      const centerX = bounds.width  / 2;
      const centerY = bounds.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) *  6;
      return { rotateX, rotateY };
    }

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease';
    });

    card.addEventListener('mousemove', e => {
      const { rotateX, rotateY } = getMousePosition(e);
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease, box-shadow 0.3s ease';
      card.style.transform  = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
  });
}

/* ─── STAT COUNTER ANIMATION ─── */
function initStatCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const rawText  = el.textContent.trim();
  const hasPlus  = rawText.includes('+');
  const numValue = parseFloat(rawText.replace('+', ''));

  if (isNaN(numValue)) return;

  const duration   = 1200;
  const startTime  = performance.now();
  const isDecimal  = !Number.isInteger(numValue);

  function update(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = numValue * eased;

    if (isDecimal) {
      el.textContent = current.toFixed(2);
    } else {
      el.textContent = Math.floor(current) + (hasPlus ? '+' : '');
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = rawText; // Restore exact original
    }
  }

  requestAnimationFrame(update);
}
