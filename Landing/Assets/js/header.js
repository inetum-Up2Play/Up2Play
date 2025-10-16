const btnMenu = document.getElementById('btn-menu');
const menu = document.getElementById('menu');
btnMenu.addEventListener('click', () => {
    menu.classList.toggle('hidden');
    menu.classList.toggle('desplegable');
});

// assets/js/header-sticky.js
document.addEventListener('DOMContentLoaded', () => {
  const bar = document.getElementById('header-section');
  const sentinel = document.getElementById('hs-sentinel');

  if (!bar || !sentinel) return;

  const setSticky = (on) => {
    // Colocar barra fija y fondo cuando se activa el sticky
    bar.classList.toggle('fixed', on);
    bar.classList.toggle('top-0', on);
    bar.classList.toggle('inset-x-0', on); // full width
    bar.classList.toggle('bg-[#3D6C3F]', on);
    bar.classList.toggle('z-30', on);
  };

  const io = new IntersectionObserver(([entry]) => {
    // Cuando el sentinel deja de intersectar (sale por arriba), activamos sticky
    setSticky(!entry.isIntersecting);
  }, { threshold: 0 });

  io.observe(sentinel);
});

