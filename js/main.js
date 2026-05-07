/* ═══════════════════════════════════════════════
   MAIN.JS — Core Interactions
   Navbar · Cursor · Typed Text · Form · Mobile
═══════════════════════════════════════════════ */

'use strict';

/* ─── DOM READY ─── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initCustomCursor();
  initTypedText();
  initContactForm();
  initScrollProgress();
  initActiveNavLink();
});

/* ─── NAVBAR SCROLL ─── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ─── HAMBURGER MENU ─── */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.classList.toggle('mobile-open');
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.classList.remove('mobile-open');
    });
  });
}

/* ─── CUSTOM CURSOR ─── */
function initCustomCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  // Only on non-touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower with RAF
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover state
  const hoverTargets = document.querySelectorAll('a, button, [data-tilt], .tag, input, textarea');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    });
  });
}

/* ─── TYPED TEXT ─── */
function initTypedText() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'data stories',
    'AI applications',
    'intelligent agents',
    'SQL pipelines',
    'Power BI dashboards',
    'RAG systems',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  function type() {
    const current = phrases[phraseIndex];

    if (!isDeleting) {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        isPaused = true;
        setTimeout(() => { isPaused = false; isDeleting = true; requestAnimationFrame(tick); }, 1800);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    if (!isPaused) setTimeout(type, isDeleting ? 45 : 80);
  }

  function tick() { type(); }

  setTimeout(type, 1400);
}

/* ─── CONTACT FORM ─── */
function initContactForm() {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;

    btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    // Simulate send (replace with real API/EmailJS/Formspree)
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
      form.reset();

      status.textContent = '✓ Message sent! I\'ll get back to you soon.';
      status.className = 'form-status success show';

      setTimeout(() => {
        status.textContent = '';
        status.className = 'form-status';
      }, 5000);
    }, 1500);
  });
}

/* ─── SCROLL PROGRESS BAR ─── */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scrollProgress';
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop    = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress     = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width    = progress + '%';
  }, { passive: true });
}

/* ─── ACTIVE NAV LINK ON SCROLL ─── */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(section => observer.observe(section));
}
