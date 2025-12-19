import { Component, computed, effect, inject } from '@angular/core';
import { SnowService } from '../../../../core/services/navidad/snow-service';

@Component({
  selector: 'app-santa-component',
  imports: [],
  templateUrl: './santa-component.html',
  styleUrl: './santa-component.scss',
})
export class SantaComponent {

  private snow = inject(SnowService);

  // Activa Santa cuando hay nieve/música
  showSanta = computed(() => this.snow.isSnowing());

  // Usa la ruta real de tu imagen (PNG con fondo transparente va perfecto)
  santaSrc = 'assets/navidad/trineo.gif';

  // Aleatoriza algunos parámetros cada vez que empieza
  constructor() {
    // Efecto reactivo: cada cambio en isSnowing reconfigura la animación
    effect(() => {
      const isOn = this.snow.isSnowing();
      if (!isOn) return;

      // Inyecta variables CSS en el :root o en el body
      const root = document.documentElement;

      // Duración aleatoria entre 10 y 18s
      const duration = `${Math.floor(10 + Math.random() * 8)}s`;
      // Radio entre 28vw y 44vw (para que en móviles no se salga)
      const radius = `${Math.floor(28 + Math.random() * 16)}vw`;
      // Dirección aleatoria: 360 o -360 grados
      const rotation = Math.random() < 0.5 ? '360deg' : '-360deg';
      // Timing aleatorio: linear o ease-in-out
      const timing = Math.random() < 0.5 ? 'linear' : 'ease-in-out';

      root.style.setProperty('--orbit-duration', duration);
      root.style.setProperty('--orbit-radius', radius);
      root.style.setProperty('--orbit-rotation', rotation);
      root.style.setProperty('--orbit-timing', timing);
    });
  }

}
