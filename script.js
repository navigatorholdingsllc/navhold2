/*
  Navigator Holdings — site scripts
  - Mobile menu (closes on link click / Escape)
  - Header shadow on scroll
  - Scroll-reveal animations
  - Copyright year
  - Contact form via Formspree (real success/error handling)
*/
(function () {
  document.documentElement.classList.add('js');

  // Mobile menu
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('mobileMenu');
  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  if (toggle && menu) {
    toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  }

  // Header state on scroll
  const header = document.getElementById('siteHeader');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Scroll reveal
  const targets = document.querySelectorAll('.card, .sector, .exp, .promise, .pillar, .process li, .strip-item, .plan-col');
  if ('IntersectionObserver' in window) {
    targets.forEach((el) => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });
    targets.forEach((el) => io.observe(el));
  }

  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Contact form
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmit');
  if (!form) return;

  const setStatus = (msg, isError) => {
    statusEl.textContent = msg;
    statusEl.classList.toggle('error', !!isError);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate required fields
    let firstInvalid = null;
    form.querySelectorAll('[required]').forEach((input) => {
      const field = input.closest('.field');
      const valid = input.value.trim() !== '' && (input.type !== 'email' || /^\S+@\S+\.\S+$/.test(input.value.trim()));
      field && field.classList.toggle('invalid', !valid);
      if (!valid && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) {
      setStatus('Please complete the highlighted fields.', true);
      firstInvalid.focus();
      return;
    }

    submitBtn.disabled = true;
    setStatus('Sending…', false);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        form.reset();
        setStatus('Thank you. Your message has been received and we will be in touch shortly.', false);
      } else {
        setStatus('Something went wrong sending your message. Please try again in a moment.', true);
      }
    } catch (err) {
      setStatus('We could not reach the server. Please check your connection and try again.', true);
    } finally {
      submitBtn.disabled = false;
    }
  });

  form.addEventListener('input', (e) => {
    const field = e.target.closest('.field');
    if (field) field.classList.remove('invalid');
  });
})();
