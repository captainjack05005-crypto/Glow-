/* ═══════════════════════════════════════════════════════════════════
   Beauty & Glow Studio — Main JavaScript
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── LOADER ─── */
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        triggerHeroAnimations();
      }, 800);
    });

    // Fallback: hide after 3s even if load stalls
    setTimeout(() => {
      loader.classList.add('hidden');
      triggerHeroAnimations();
    }, 3000);
  }

  function triggerHeroAnimations() {
    document.querySelectorAll('.hero .reveal-up').forEach(el => {
      el.classList.add('revealed');
    });
  }

  /* ─── STICKY NAV ─── */
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    function onScroll() {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─── MOBILE NAV TOGGLE ─── */
  function initMobileNav() {
    const toggle  = document.getElementById('navToggle');
    const menu    = document.getElementById('navMenu');
    const navbar  = document.getElementById('navbar');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close when a link is clicked
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        menu.classList.remove('open');
        toggle.classList.remove('open');
      }
    });
  }

  /* ─── SCROLL REVEAL (Intersection Observer) ─── */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll(
      '.reveal-up:not(.hero .reveal-up), .reveal-left, .reveal-right'
    );
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => observer.observe(el));
  }

  /* ─── TESTIMONIAL SLIDER ─── */
  function initTestimonialSlider() {
    const track  = document.getElementById('testimonialTrack');
    const prev   = document.getElementById('tPrev');
    const next   = document.getElementById('tNext');
    const dotsEl = document.getElementById('testimonialDots');
    if (!track || !prev || !next) return;

    const slides = track.querySelectorAll('.testimonial-slide');
    const dots   = dotsEl ? dotsEl.querySelectorAll('.testimonial-dot') : [];
    let   current = 0;
    let   autoTimer;

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function startAuto() {
      autoTimer = setInterval(() => goTo(current + 1), 5500);
    }
    function stopAuto() { clearInterval(autoTimer); }

    prev.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    next.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
    });

    // Swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) {
        stopAuto();
        goTo(dx < 0 ? current + 1 : current - 1);
        startAuto();
      }
    });

    startAuto();
  }

  /* ─── SCROLL-TO-TOP ─── */
  function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── SMOOTH SCROLLING for anchor links ─── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 80;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ─── ACTIVE NAV LINK on scroll ─── */
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar__link');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${id}`
              );
            });
          }
        });
      },
      { threshold: 0.45 }
    );

    sections.forEach(s => observer.observe(s));
  }

  /* ─── BOOKING FORM VALIDATION ─── */
  function initBookingForm() {
    const form      = document.getElementById('bookingForm');
    const submitBtn = document.getElementById('submitBtn');
    const success   = document.getElementById('formSuccess');
    if (!form) return;

    // Set min date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
      const today = new Date();
      const yyyy  = today.getFullYear();
      const mm    = String(today.getMonth() + 1).padStart(2, '0');
      const dd    = String(today.getDate()).padStart(2, '0');
      dateInput.setAttribute('min', `${yyyy}-${mm}-${dd}`);
    }

    function setError(fieldId, msg) {
      const input = document.getElementById(fieldId);
      const errEl = document.getElementById(fieldId + 'Error');
      if (input) input.classList.toggle('invalid', !!msg);
      if (errEl) errEl.textContent = msg || '';
    }

    function validateField(id, value) {
      switch (id) {
        case 'fullName':
          if (!value.trim())         return 'Full name is required.';
          if (value.trim().length < 3) return 'Name must be at least 3 characters.';
          return '';
        case 'phone':
          if (!value.trim())                 return 'Phone number is required.';
          if (!/^\+?[\d\s\-]{8,15}$/.test(value.trim())) return 'Enter a valid phone number.';
          return '';
        case 'email':
          if (!value.trim()) return 'Email is required.';
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.';
          return '';
        case 'service':
          if (!value) return 'Please select a service.';
          return '';
        case 'date':
          if (!value) return 'Please select a preferred date.';
          return '';
        default:
          return '';
      }
    }

    // Live validation
    ['fullName', 'phone', 'email', 'service', 'date'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('blur', () => setError(id, validateField(id, el.value)));
      el.addEventListener('input', () => {
        if (el.classList.contains('invalid')) {
          setError(id, validateField(id, el.value));
        }
      });
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();

      // Validate all fields
      const fields = ['fullName', 'phone', 'email', 'service', 'date'];
      let valid = true;
      fields.forEach(id => {
        const el  = document.getElementById(id);
        const err = validateField(id, el ? el.value : '');
        setError(id, err);
        if (err) valid = false;
      });
      if (!valid) return;

      // Simulate submission
      const btnText   = submitBtn.querySelector('.btn-text');
      const btnLoader = submitBtn.querySelector('.btn-loader');
      submitBtn.disabled = true;
      btnText.hidden = true;
      btnLoader.hidden = false;

      await delay(1600);

      form.hidden = true;
      success.hidden = false;
    });
  }

  /* ─── PARALLAX HERO (subtle) ─── */
  function initHeroParallax() {
    const hero = document.querySelector('.hero');
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return; // skip on mobile

    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      hero.style.backgroundPositionY = `calc(50% + ${y * 0.35}px)`;
    }, { passive: true });
  }

  /* ─── GALLERY LIGHTBOX (minimal) ─── */
  function initGalleryLightbox() {
    const items = document.querySelectorAll('.gallery__item');
    if (!items.length) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 2000;
      background: rgba(42,31,24,.92); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      padding: 2rem; cursor: zoom-out;
      opacity: 0; visibility: hidden;
      transition: opacity .3s, visibility .3s;
    `;

    const img = document.createElement('img');
    img.style.cssText = `
      max-width: 90vw; max-height: 85vh; object-fit: contain;
      border-radius: 8px; box-shadow: 0 32px 80px rgba(0,0,0,.5);
      transform: scale(.95); transition: transform .4s cubic-bezier(0.16,1,0.3,1);
    `;

    const caption = document.createElement('p');
    caption.style.cssText = `
      position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
      font-family: 'Cormorant Garamond', serif; font-style: italic;
      color: rgba(244,233,201,.7); font-size: 1rem;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.style.cssText = `
      position: absolute; top: 1.5rem; right: 2rem;
      color: rgba(244,233,201,.7); font-size: 2.5rem; line-height: 1;
      background: none; border: none; cursor: pointer; font-family: serif;
      transition: color .2s;
    `;
    closeBtn.addEventListener('mouseenter', () => { closeBtn.style.color = '#C9A96E'; });
    closeBtn.addEventListener('mouseleave', () => { closeBtn.style.color = 'rgba(244,233,201,.7)'; });

    overlay.appendChild(img);
    overlay.appendChild(caption);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    function open(src, alt) {
      img.src = src.replace(/w=\d+/, 'w=1200');
      caption.textContent = alt;
      overlay.style.visibility = 'visible';
      overlay.style.opacity = '1';
      setTimeout(() => { img.style.transform = 'scale(1)'; }, 10);
      document.body.style.overflow = 'hidden';
    }

    function close() {
      overlay.style.opacity = '0';
      img.style.transform = 'scale(.95)';
      setTimeout(() => {
        overlay.style.visibility = 'hidden';
        document.body.style.overflow = '';
      }, 300);
    }

    items.forEach(item => {
      item.addEventListener('click', () => {
        const imgEl = item.querySelector('img');
        if (imgEl) open(imgEl.src, imgEl.alt);
      });
    });

    overlay.addEventListener('click', e => { if (e.target === overlay || e.target === closeBtn) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  /* ─── UTILITY ─── */
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /* ─── INIT ─── */
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initNavbar();
    initMobileNav();
    initScrollReveal();
    initTestimonialSlider();
    initScrollTop();
    initSmoothScroll();
    initActiveNav();
    initBookingForm();
    initHeroParallax();
    initGalleryLightbox();
  });

})();
