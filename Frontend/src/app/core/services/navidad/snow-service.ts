import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SnowService {
  
  isSnowing = signal(false);


  private audio = new Audio('assets/audio/navidad.mp3'); // ← pon tu ruta real

  constructor() {
    // Config del audio
    this.audio.loop = true;
    this.audio.preload = 'auto';
    this.audio.volume = 0.35; // ajusta el volumen inicial
   }

  /** Empieza nieve + música */
  async start() {
    this.isSnowing.set(true);
    try {
      this.audio.currentTime = 0; // opcional: empezar cada vez desde el inicio
      await this.audio.play();    // esto funciona porque lo llamas desde un click (gesto usuario)
    } catch (err) {
      console.warn('No se pudo reproducir audio:', err);
    }
  }

  /** Para nieve + música */
  stop() {
    this.isSnowing.set(false);
    this.audio.pause();
  }

  /** Alterna ambos estados en un solo gesto */
  async toggle() {
    const next = !this.isSnowing();
    if (next) await this.start();
    else this.stop();
  }


}
