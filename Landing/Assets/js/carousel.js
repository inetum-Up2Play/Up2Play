// carousel.lite.js
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-carousel]').forEach(initCarousel);
});

function initCarousel(root) {
  const viewport = root.querySelector('[data-carousel-viewport]');
  const track = root.querySelector('[data-carousel-track]');
  const slides = Array.from(track.children);
  const prev = root.querySelector('[data-carousel-prev]');
  const next = root.querySelector('[data-carousel-next]');
  const dots = root.querySelector('[data-carousel-dots]');
  const mql = matchMedia('(min-width: 1024px)');

  let perView = mql.matches ? 3 : 1;
  let page = 0;
  let pages = Math.ceil(slides.length / perView);

  mql.addEventListener('change', () => {
    perView = mql.matches ? 3 : 1;
    pages = Math.ceil(slides.length / perView);
    renderDots();
    go(page); // realinea la vista
  });

  function renderDots() {
    dots.innerHTML = '';
    for (let i = 0; i < pages; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'h-2 w-2 rounded-full bg-slate-300 aria-[current=true]:bg-slate-800';
      b.setAttribute('aria-current', i === page ? 'true' : 'false');
      b.addEventListener('click', () => go(i));
      dots.appendChild(b);
    }
  }

  function go(p) {
    page = Math.max(0, Math.min(p, pages - 1));
    const idx = page * perView;
    const target = slides[idx];
    if (target) viewport.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
    update();
  }

  function update() {
    prev.disabled = page === 0;
    next.disabled = page >= pages - 1;
    dots.querySelectorAll('button').forEach((b, i) =>
      b.setAttribute('aria-current', i === page ? 'true' : 'false')
    );
  }

  prev.addEventListener('click', () => go(page - 1));
  next.addEventListener('click', () => go(page + 1));

  // Sincroniza al hacer swipe/drag (sin throttle para mantenerlo corto)
  viewport.addEventListener('scroll', () => {
    const left = viewport.scrollLeft;
    let first = 0;
    for (let i = 0; i < slides.length; i++) {
      if (slides[i].offsetLeft <= left + 1) first = i; else break;
    }
    page = Math.min(Math.floor(first / perView), pages - 1);
    update();
  });

  renderDots();
  go(0);
}


document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll('[data-carousel-track] > li > article');
  let maxHeight = 0;

  cards.forEach(card => {
    card.style.height = 'auto'; // Reset height
    const height = card.offsetHeight;
    if (height > maxHeight) maxHeight = height;
  });

  cards.forEach(card => {
    card.style.height = `${maxHeight}px`;
  });
});
