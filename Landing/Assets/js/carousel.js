document.addEventListener('DOMContentLoaded', () => {

  // --- DATOS ---
  const slidesData = [
    { id: 1, image: "https://up2play-mvp.github.io/CDN/deportes/voleibol.webp", title: "Partido de Voley 5v5", description: "Gratis", button: "¡Apúntate!", subtitle: "19/12/2025 - 18:30h", location: "Polideportivo Dehesa de Navalcarbón" },
    { id: 2, image: "https://up2play-mvp.github.io/CDN/deportes/padel.webp", title: "Torneo de Padel", description: "5€", button: "¡Apúntate!", subtitle: "20/12/2025 - 10:00h", location: "Club de Padel Tarragona" },
    { id: 3, image: "https://up2play-mvp.github.io/CDN/deportes/basquet.webp", title: "Torneo 3 vs 3", description: "Gratis", button: "¡Apúntate!", subtitle: "21/12/2025 - 17:00h", location: "Pista Municipal Campclar" },
    { id: 4, image: "https://up2play-mvp.github.io/CDN/deportes/running.webp", title: "RunClub Playa", description: "Gratis", button: "¡Apúntate!", subtitle: "22/12/2025 - 07:00h", location: "Playa del Milagro" },
    { id: 5, image: "https://up2play-mvp.github.io/CDN/deportes/crossfit.webp", title: "Crossfit Intro", description: "Gratis", button: "¡Apúntate!", subtitle: "23/12/2025 - 19:00h", location: "Box Oficial Tarraco" },
    { id: 6, image: "https://up2play-mvp.github.io/CDN/deportes/boxeo.webp", title: "Sparring Boxeo", description: "Gratis", button: "¡Apúntate!", subtitle: "24/12/2025 - 11:00h", location: "Gimnasio KO" },
    { id: 7, image: "https://up2play-mvp.github.io/CDN/deportes/ciclismo.webp", title: "Ruta La Mussara", description: "Gratis", button: "¡Apúntate!", subtitle: "26/12/2025 - 08:00h", location: "Salida Plaza Imperial" },
    { id: 8, image: "https://up2play-mvp.github.io/CDN/deportes/surf.webp", title: "Surf Camp", description: "120€", button: "¡Apúntate!", subtitle: "27/12/2025 - 09:00h", location: "Playa Arrabassada" },
    { id: 9, image: "https://up2play-mvp.github.io/CDN/deportes/golf.webp", title: "Golf 18 hoyos", description: "35€", button: "¡Apúntate!", subtitle: "28/12/2025 - 10:00h", location: "Club Golf Costa Daurada" },
  ];

  // --- ESTADO ---
  let currentSlide = 0;
  let visibleSlides = 1;
  let slidePercentage = 100;
  let step = 1;

  // --- DOM ELEMENTS ---
  const track = document.getElementById('carousel-track');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const dotsContainer = document.getElementById('carousel-dots');

  // --- LÓGICA AVANZAR CAROUSEL ---
  function init() {
    renderSlides();
    updateLayout();
    updateUI();
    window.addEventListener('resize', () => {
      updateLayout();
      updateUI();
    });

    btnPrev.addEventListener('click', prev);
    btnNext.addEventListener('click', next);
  }

  function renderSlides() {
    track.innerHTML = slidesData.map(slide => `
                    <div class="w-full md:w-1/3 shrink-0 px-3 py-4">
                        <div class="rounded-[3%] overflow-hidden h-full shadow-lg bg-white">
                            <div class="wrapper h-full">
                                <div class="card">
                                    <img src="${slide.image}" class="card-image" alt="${slide.title}">
                                    <div class="card-body">
                                        <p class="subtitle">${slide.subtitle}</p>
                                        <p class="title link">${slide.title}</p>
                                        <p class="location mb-2">${slide.location}</p>
                                        <p class="text-sm font-bold text-green-700 mt-auto">${slide.description}</p>
                                    </div>
                                    <div class="card-footer">
                                        <button class="btn btn-primary"><a href="http://localhost:4201/auth/register">${slide.button}</a></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('');
  }

  function updateLayout() {
    if (window.innerWidth < 768) {
      visibleSlides = 1;
      slidePercentage = 100;
    } else {
      visibleSlides = 3;
      slidePercentage = 100 / 3;
    }
    step = visibleSlides;

    // Ajustar posición si nos pasamos al redimensionar
    const maxStart = getMaxStartIndex();
    if (currentSlide > maxStart) {
      currentSlide = maxStart;
    }

    renderDots();
  }

  function getMaxStartIndex() {
    return Math.max(0, slidesData.length - visibleSlides);
  }

  function updateUI() {
    // Mover track
    const translateX = -(currentSlide * slidePercentage);
    track.style.transform = `translateX(${translateX}%)`;

    // Actualizar botones
    const maxStart = getMaxStartIndex();
    btnPrev.disabled = currentSlide <= 0;
    btnNext.disabled = currentSlide >= maxStart;

    // Actualizar opacidad de botones (Tailwind classes)
    toggleButtonState(btnPrev, currentSlide <= 0);
    toggleButtonState(btnNext, currentSlide >= maxStart);

    // Actualizar dots
    updateDots();
  }

  function toggleButtonState(btn, isDisabled) {
    if (isDisabled) {
      btn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      btn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  }

  function prev() {
    if (currentSlide > 0) {
      currentSlide = Math.max(0, currentSlide - step);
      updateUI();
    }
  }

  function next() {
    const maxStart = getMaxStartIndex();
    if (currentSlide < maxStart) {
      currentSlide = Math.min(maxStart, currentSlide + step);
      updateUI();
    }
  }

  function renderDots() {
    const totalBlocks = Math.ceil(slidesData.length / visibleSlides);

    // Si solo hay 1 bloque o estamos en móvil (visibleSlides=1), quizás quieras ocultar dots o cambiarlos
    // Aquí seguiremos la lógica original: dots visibles en desktop (hidden md:flex en HTML)

    let dotsHtml = '';
    for (let i = 0; i < totalBlocks; i++) {
      dotsHtml += `<button data-index="${i}" class="dot-btn w-5! h-5! rounded-full! transition-all! duration-300! bg-gray-300! hover:bg-gray-400! cursor-pointer"></button>`;
    }
    dotsContainer.innerHTML = dotsHtml;

    // Añadir listeners a los nuevos dots
    document.querySelectorAll('.dot-btn').forEach(dot => {
      dot.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index);
        currentSlide = idx * visibleSlides;
        // Clamp por seguridad
        currentSlide = Math.min(currentSlide, getMaxStartIndex());
        updateUI();
      });
    });
  }

  function updateDots() {
    const currentBlock = Math.floor(currentSlide / visibleSlides);
    const dots = document.querySelectorAll('.dot-btn');

    dots.forEach((dot, index) => {
      if (index === currentBlock) {
        dot.classList.remove('bg-gray-300!', 'hover:bg-gray-400!');
        dot.classList.add('bg-[#B1DF75]!', 'scale-125!');
      } else {
        dot.classList.add('bg-gray-300!', 'hover:bg-gray-400!');
        dot.classList.remove('bg-[#B1DF75]!', 'scale-125!');
      }
    });
  }

  // Arrancar
  init();
});