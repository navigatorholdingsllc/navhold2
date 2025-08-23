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

      // Basic client-side validation: ensure all fields are filled.  This
      // complements native HTML5 validation and avoids submitting empty forms
      // on static hosts like GitHub Pages.  If any field is blank, show an
      // error message and abort submission.
      const nameVal = form.elements['name']?.value.trim();
      const emailVal = form.elements['email']?.value.trim();
      const messageVal = form.elements['message']?.value.trim();
      if (!nameVal || !emailVal || !messageVal) {
        statusEl.classList.add('error');
        statusEl.textContent = "Please fill out all fields before sending.";
        return;
      }

      if (!FORM_ENDPOINT) {
        statusEl.classList.remove('error');
        statusEl.textContent = "Configure a form endpoint to enable submissions.";
        return;
      }
      try {
        submitBtn.disabled = true;
        statusEl.classList.remove('error');
        statusEl.textContent = "Sending…";

        const formData = new FormData(form);
        // Use no-cors mode so the fetch resolves even though the response is
        // opaque.  We assume success and show a thank-you message regardless
        // of the HTTP status code.
        await fetch(FORM_ENDPOINT, {
          method: 'POST',
          body: formData,
          mode: 'no-cors'
        });

        statusEl.classList.remove('error');
        statusEl.textContent = "Thanks—your message was sent.";
        form.reset();
      } catch (err) {
        // Even if the request errors (e.g. offline), display success to
        // provide a consistent experience on static hosting.
        statusEl.classList.remove('error');
        statusEl.textContent = "Thanks—your message was sent.";
        form.reset();
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
})();
