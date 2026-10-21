/**
 * Header Dojo Ryokan — Menú móvil (hamburguesa) y comportamiento al hacer scroll
 * 100% JavaScript vainilla, sin dependencias.
 */
(function () {
  'use strict';

  const header = document.getElementById('rk-header');
  const topbar = header ? header.querySelector('.rk-topbar') : null;
  const burger = document.getElementById('rk-burger');
  const menu = document.getElementById('rk-menu');
  const closeBtn = document.getElementById('rk-drawer-close');

  if (!header || !burger || !menu) return;

  const root = document.documentElement;
  const mobileQuery = window.matchMedia('(max-width: 1100px)');

  /* ------------------------------------------------------------------------
     1. Medir alturas reales del header y exponerlas como variables CSS.
        En móvil, la barra roja está oculta (display: none), por lo que
        --rk-topbar-h se calcula como 0px automáticamente.
     ------------------------------------------------------------------------ */
  function updateHeights() {
    const isTopbarVisible = topbar && window.getComputedStyle(topbar).display !== 'none';
    const topbarH = isTopbarVisible ? topbar.offsetHeight : 0;
    root.style.setProperty('--rk-topbar-h', topbarH + 'px');
    root.style.setProperty('--rk-header-h', header.offsetHeight + 'px');
  }

  updateHeights();
  if ('ResizeObserver' in window) {
    new ResizeObserver(updateHeights).observe(header);
  } else {
    window.addEventListener('resize', updateHeights);
  }

  /* ------------------------------------------------------------------------
     2. Abrir / cerrar el menú móvil
     ------------------------------------------------------------------------ */
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('rk-nav-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  }

  function isOpen() {
    return menu.classList.contains('is-open');
  }

  burger.addEventListener('click', function (e) {
    e.stopPropagation();
    setMenu(!isOpen());
  });

  // Botón de cierre 'X' interno en el drawer móvil
  if (closeBtn) {
    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      setMenu(false);
      burger.focus();
    });
  }

  // Cerrar al elegir un enlace
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setMenu(false);
    });
  });

  // Cerrar al hacer clic fuera del header
  document.addEventListener('click', function (e) {
    if (isOpen() && !header.contains(e.target)) setMenu(false);
  });

  // Cerrar con Escape y devolver el foco al botón (accesibilidad)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) {
      setMenu(false);
      burger.focus();
    }
  });

  // Si se pasa a escritorio con el menú abierto, se reinicia el estado
  mobileQuery.addEventListener('change', function (e) {
    if (!e.matches) setMenu(false);
  });

  /* ------------------------------------------------------------------------
     3. Al hacer scroll: ocultar la barra roja (queda fija solo la negra)
     ------------------------------------------------------------------------ */
  let ticking = false;
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 60);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  onScroll();
})();
