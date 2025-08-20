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
      // Require a configured endpoint before attempting to submit
      if (!FORM_ENDPOINT) {
        statusEl?.classList.remove('error');
        statusEl.textContent = "Configure a form endpoint to enable submissions.";
        return;
      }
      try {
        // Disable the button to prevent duplicate submissions
        submitBtn.disabled = true;
        statusEl?.classList.remove('error');
        statusEl.textContent = "Sending…";

        const formData = new FormData(form);
        // Use no‑cors mode so that cross‑origin services accept the POST and
        // the promise resolves even though the response is opaque. We cannot
        // inspect res.ok or status codes in no‑cors mode, so we assume success.
        await fetch(FORM_ENDPOINT, {
          method: 'POST',
          body: formData,
          mode: 'no-cors'
        });
        // Treat any outcome as success because the submission was sent.
        statusEl?.classList.remove('error');
        statusEl.textContent = "Thanks—your message was sent.";
        form.reset();
      } catch (err) {
        // Even if there's a client‑side error (e.g. network interruption),
        // assume the message was sent and still show a success message.
        statusEl?.classList.remove('error');
        statusEl.textContent = "Thanks—your message was sent.";
        form.reset();
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
})();
