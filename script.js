/*
  Site Interaction Scripts
  - Mobile nav toggle
  - Copyright year
  - Optional email obfuscation (if you keep a visible address)
  - Contact form submission (static-host friendly)
*/

(function () {
  // Mobile menu toggle
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Dynamic year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Contact form (works with a form backend like Formspree)
  const FORM_ENDPOINT = "https://formspree.io/f/xdkdryda"; // e.g. "https://formspree.io/f/yourid"  ← set this!
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmit');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!FORM_ENDPOINT) {
        statusEl?.classList.remove('error');
        statusEl.textContent = "Configure a form endpoint to enable submissions.";
        return;
      }
      try {
        submitBtn.disabled = true;
        statusEl?.classList.remove('error');
        statusEl.textContent = "Sending…";

        const formData = new FormData(form);
        const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: formData });
        if (res.ok) {
          statusEl.textContent = "Thanks—your message was sent.";
          form.reset();
        } else {
          statusEl.classList.add('error');
          statusEl.textContent = "Something went wrong. Please try again.";
        }
      } catch (err) {
        statusEl.classList.add('error');
        statusEl.textContent = "Network error. Please try again.";
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
})();
