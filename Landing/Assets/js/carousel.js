function carousel() {
  return {
    currentSlide: 0,
    visibleSlides: 1, // 1 en sm, 3 en md+
    slidePercentage: 100, // 100% cuando 1 por vista; 33.333% cuando 3 por vista
    step: 1, // cuánto avanza prev/next (== visibleSlides)
    slides: [
      {
        id: 1,
        image: "https://picsum.photos/id/10/800/600",
        title: "Ioga al Parc",
        description: "Gratis",
        button: "¡Apúntate!",
      },
      {
        id: 2,
        image: "https://picsum.photos/id/11/800/600",
        title: "Meditación",
        description: "Gratis",
        button: "¡Apúntate!",
      },
      {
        id: 3,
        image: "https://picsum.photos/id/12/800/600",
        title: "Pilates",
        description: "Gratis",
        button: "¡Apúntate!",
      },
      {
        id: 4,
        image: "https://picsum.photos/id/13/800/600",
        title: "Running",
        description: "Gratis",
        button: "¡Apúntate!",
      },
      {
        id: 5,
        image: "https://picsum.photos/id/14/800/600",
        title: "Crossfit",
        description: "Gratis",
        button: "¡Apúntate!",
      },
      {
        id: 6,
        image: "https://picsum.photos/id/15/800/600",
        title: "Boxeo",
        description: "Gratis",
        button: "¡Apúntate!",
      },
      {
        id: 7,
        image: "https://picsum.photos/id/16/800/600",
        title: "Zumba",
        description: "Gratis",
        button: "¡Apúntate!",
      },
      {
        id: 8,
        image: "https://picsum.photos/id/17/800/600",
        title: "Yoga Avanzado",
        description: "Gratis",
        button: "¡Apúntate!",
      },
      {
        id: 9,
        image: "https://picsum.photos/id/18/800/600",
        title: "Stretching",
        description: "Gratis",
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
