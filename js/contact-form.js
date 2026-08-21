(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  var WA_NUMBER = '524661470586';
  var EMAIL = 'unlockmxpro@gmail.com';

  function field(name) {
    var el = form.elements[name];
    return el ? String(el.value || '').trim() : '';
  }

  function buildMessage() {
    var telefono = field('telefono');
    var lines = [
      'Hola UnlockMxPro, quiero una cotización.',
      'Nombre: ' + field('nombre'),
      'Email: ' + field('email')
    ];
    if (telefono) lines.push('Teléfono: ' + telefono);
    lines.push('Servicio: ' + field('servicio'), '', field('mensaje'));
    return lines.join('\n');
  }

  function showStatus(text) {
    var el = document.getElementById('contact-status');
    if (!el) return;
    el.hidden = false;
    el.textContent = text;
  }

  function isValid() {
    return form.reportValidity();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!isValid()) return;
    var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(buildMessage());
    window.open(url, '_blank', 'noopener');
    showStatus('Te abrimos WhatsApp con tu mensaje listo. Si no se abrió, usa “Enviar por correo”.');
  });

  var emailBtn = document.getElementById('contact-email');
  if (emailBtn) {
    emailBtn.addEventListener('click', function () {
      if (!isValid()) return;
      var subject = 'Cotización UnlockMxPro — ' + field('servicio');
      var url = 'mailto:' + EMAIL
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(buildMessage());
      window.location.href = url;
      showStatus('Se abrió tu correo. Si no, escríbenos a ' + EMAIL + '.');
    });
  }
})();
