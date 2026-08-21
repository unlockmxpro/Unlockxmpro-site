(function () {
  'use strict';

  var btn = document.querySelector('.hamburger');
  var nav = document.getElementById('site-nav');
  if (!btn || !nav) return;

  function isOpen() {
    return nav.classList.contains('open');
  }

  function setOpen(open) {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('nav-open', open);
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(!isOpen());
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setOpen(false);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  document.addEventListener('click', function (e) {
    if (isOpen() && !nav.contains(e.target) && !btn.contains(e.target)) {
      setOpen(false);
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && isOpen()) setOpen(false);
  });
})();
