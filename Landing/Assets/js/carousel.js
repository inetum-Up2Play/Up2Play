function carousel() {
  return {
    currentSlide: 0,
    visibleSlides: 1, // 1 en sm, 3 en md+
    slidePercentage: 100, // 100% cuando 1 por vista; 33.333% cuando 3 por vista
    step: 1, // cuánto avanza prev/next (== visibleSlides)
    slides: [
      {
        id: 1,
        image: "https://up2play-mvp.github.io/CDN/deportes/padel.webp",
        title: "Padel, nivel intermedio, en Tarragona Padel Indoor",
        description: "5€",
        button: "¡Apúntate!",
      },
      {
        id: 2,
        image: "https://up2play-mvp.github.io/CDN/deportes/esqui.webp",
        title: "Esquí",
        description: "Sube baja esquí, a GranValira, Andorra. Gastos de gasolina, y material.",
        button: "¡Apúntate!",
      },
      {
        id: 3,
        image: "https://up2play-mvp.github.io/CDN/deportes/basquet.webp",
        title: "3x3 de Basquet en Tarragona",
        description: "Partidos a 21 puntos, de 3 contra 3. Apúntate, para más informacion",
        button: "¡Apúntate!",
      },
      {
        id: 4,
        image: "https://up2play-mvp.github.io/CDN/deportes/running.webp",
        title: "Club de Running en Playa Arrabassada",
        description: "Gratis",
        button: "¡Apúntate!",
      },
      {
        id: 5,
        image: "https://up2play-mvp.github.io/CDN/deportes/futbol.webp",
        title: "Pachanga de futbol, amistoso en Tarragona",
        description: "Únete a un partido de futbol amistoso, para pasarlo bien.",
        button: "¡Apúntate!",
      },
      {
        id: 6,
        image: "https://up2play-mvp.github.io/CDN/deportes/voleibol.webp",
        title: "Partido de Voley en la Playa Arrabassada",
        description: "Gratis, ganas de pasarlo bien.",
        button: "¡Apúntate!",
      },
      {
        id: 7,
        image: "https://up2play-mvp.github.io/CDN/deportes/petanca.webp",
        title: "Petanca con público diverso",
        description: "Juega partidas de petancas en Tarragona",
        button: "¡Apúntate!",
      },
      {
        id: 8,
        image: "https://up2play-mvp.github.io/CDN/deportes/patinaje.webp",
        title: "Patinaje en la pista de Hielo",
        description: "Ven a patinar con nosotros en la pista de hielo de Tarragona.",
        button: "¡Apúntate!",
      },
      {
        id: 9,
        image: "https://up2play-mvp.github.io/CDN/deportes/hockey.webp",
        title: "Aprender a jugar Hockey en el Nástic.",
        description: "Ven a jugar a Hockey, 5€.",
        button: "¡Apúntate!",
      },
    ],

    // Derivados / getters
    get maxStartIndex() {
      // último índice de inicio válido para llenar la vista
      return Math.max(0, this.slides.length - this.visibleSlides);
    },
    get isAtStart() {
      return this.currentSlide <= 0;
    },
    get isAtEnd() {
      return this.currentSlide >= this.maxStartIndex;
    },
    get totalPages() {
      // número de "bloques" (para dots)
      return Math.ceil(this.slides.length / this.visibleSlides);
    },

    init() {
      this.updateLayoutByWidth();
      // Recalcular en resize y ajustar índice para no pasarnos
      window.addEventListener("resize", () => {
        const prevVisible = this.visibleSlides;
        this.updateLayoutByWidth();
        if (this.visibleSlides !== prevVisible) {
          // al cambiar de 1↔3, alineamos para no dejar huecos
          this.currentSlide = Math.min(this.currentSlide, this.maxStartIndex);
        }
      });
    },

    updateLayoutByWidth() {
      if (window.innerWidth < 768) {
        this.visibleSlides = 1;
        this.slidePercentage = 100;
      } else {
        this.visibleSlides = 3;
        this.slidePercentage = 100 / 3;
      }
      // Paso = cuántas se ven (1 en sm, 3 en md+)
      this.step = this.visibleSlides;
    },

    clamp(i) {
      return Math.max(0, Math.min(i, this.maxStartIndex));
    },

    next() {
      if (this.currentSlide < this.maxStartIndex) {
        this.currentSlide = this.clamp(this.currentSlide + this.step);
      }
    },

    prev() {
      if (this.currentSlide > 0) {
        this.currentSlide = this.clamp(this.currentSlide - this.step);
      }
    },

    goTo(i) {
      this.currentSlide = this.clamp(i);
    },

    handleImageError(slide) {
      slide.image =
        "https://via.placeholder.com/800x600?text=Imagen+no+disponible";
    },
  };
}
