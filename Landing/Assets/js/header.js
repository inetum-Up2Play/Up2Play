const btnMenu = document.getElementById('btn-menu');
const menu = document.getElementById('menu');

btnMenu.addEventListener('click', () => {
    menu.classList.toggle('hidden');
    menu.classList.toggle('desplegable');
});

function ajustarAlturaDelEspaciador() {
  const header = document.getElementById('header-section');
  const spacer = document.getElementById('header-spacer');

  if (!header || !spacer) return;

  const altura = header.getBoundingClientRect().height;
  spacer.style.height = `${altura}px`;
}

window.addEventListener('load', ajustarAlturaDelEspaciador);
window.addEventListener('resize', ajustarAlturaDelEspaciador);


function activarFondoAlScroll() {
  const header = document.getElementById('header-section');
  if (!header) return;

  function actualizarFondo() {
    const scrolled = window.scrollY > 0;
    header.classList.toggle('scrolled', scrolled);
  }

  window.addEventListener('scroll', actualizarFondo, { passive: true });
  window.addEventListener('load', actualizarFondo);
}
activarFondoAlScroll();