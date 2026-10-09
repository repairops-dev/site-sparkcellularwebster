/* Spark Cellular lead form handler.
   Do not rename input "name" attributes and do not change the endpoint; they map into the RepairOps lead system. */
(function () {
  var THANK_YOU = '/thank-you/';
  var ENDPOINT = 'https://crd.findloc.shop/api/submit-form';
  var forms = document.querySelectorAll('form.spark-lead-form');
  Array.prototype.forEach.call(forms, function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var statusEl = form.querySelector('.form-status');
      var raw = Object.fromEntries(new FormData(form).entries());
      if (!raw.full_name || !raw.phone || !raw.email) {
        statusEl.textContent = 'Please fill in your name, phone and email.';
        statusEl.style.color = '#c0392b';
        return;
      }
      var interest = raw.interest ? '[' + raw.interest + '] ' : '';
      var payload = {
        public_form_key: 'db1337ab-5c8b-4de6-867b-46a06f62fd27',
        honeypot: raw.honeypot || '',
        location_key: 'ChIJv_gCqoebQIYRsFYMxIOpmlY',
        location_name: 'Webster',
        page_url: window.location.href,
        page_title: document.title,
        fields: {
          full_name: raw.full_name,
          email: raw.email,
          phone: raw.phone,
          device_model: raw.device_model || '',
          issue: interest + (raw.issue || '')
        }
      };
      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      statusEl.textContent = 'Sending...';
      statusEl.style.color = '#5b6878';
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (res) {
        if (!res.ok) throw new Error('Submission failed');
        form.reset();
        window.location.href = THANK_YOU;
      }).catch(function () {
        if (btn) btn.disabled = false;
        statusEl.textContent = 'Something went wrong. Please call us at (346) 644-5044.';
        statusEl.style.color = '#c0392b';
      });
    });
  });
})();
