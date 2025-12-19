import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';

type Flake = {
  x: number;
  y: number;
  r: number;      // radio
  vy: number;     // velocidad vertical
  vx: number;     // velocidad horizontal (viento)
  alpha: number;  // opacidad
};

@Component({
  selector: 'app-snowfall-component',
  imports: [],
  templateUrl: './snowfall-component.html',
  styleUrl: './snowfall-component.scss',
})
export class SnowfallComponent implements AfterViewInit {

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private flakes: Flake[] = [];
  private animationId: number | null = null;

  // Configurables
  private density = 160;              // número de copos (ajusta según rendimiento)
  private color = '255,255,255';      // RGB
  private wind = 0.15;                // viento base
  private swayAmplitude = 0.6;        // oscilación horizontal
  private maxVy = 1.6;                // velocidad vertical máxima
  private minVy = 0.4;                // velocidad vertical mínima
  private minR = 1.2;                 // radio mínimo
  private maxR = 3.5;                 // radio máximo

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    this.ctx = ctx;

    this.resize();
    this.initFlakes();
    this.loop();
  }

  @HostListener('window:resize')
  resize() {
    const canvas = this.canvasRef.nativeElement;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(canvas.clientWidth * dpr);
    canvas.height = Math.floor(canvas.clientHeight * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private rand(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  private initFlakes() {
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    this.flakes = Array.from({ length: this.density }).map(() => ({
      x: this.rand(0, w),
      y: this.rand(-h, h),
      r: this.rand(this.minR, this.maxR),
      vy: this.rand(this.minVy, this.maxVy),
      vx: this.rand(-this.wind, this.wind),
      alpha: this.rand(0.6, 0.95)
    }));
  }

  private loop = () => {
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    this.ctx.clearRect(0, 0, w, h);

    // pequeño “viento” oscilante
    const t = performance.now() * 0.001;
    const sway = Math.sin(t) * this.swayAmplitude;

    for (const f of this.flakes) {
      f.y += f.vy;
      f.x += f.vx + sway * 0.05;

      // wrap-around cuando sale de pantalla
      if (f.y > h + 10) {
        f.y = -10;
        f.x = this.rand(0, w);
      }
      if (f.x < -10) f.x = w + 10;
      if (f.x > w + 10) f.x = -10;

      this.ctx.globalAlpha = f.alpha;
      this.ctx.fillStyle = `rgba(${this.color}, ${f.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.animationId = requestAnimationFrame(this.loop);
  };

   ngOnDestroy() {
    if (this.animationId !== null) cancelAnimationFrame(this.animationId);
  }

}
