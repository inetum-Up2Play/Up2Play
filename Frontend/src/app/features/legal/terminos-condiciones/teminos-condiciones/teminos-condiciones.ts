import { CommonModule, ViewportScroller, Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Header } from '../../../../core/layout/header/header';
import { Footer } from '../../../../core/layout/footer/footer';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-teminos-condiciones',
  imports: [CommonModule, ButtonModule, Header, Footer, RouterLink],
  templateUrl: './teminos-condiciones.html',
  styleUrl: './teminos-condiciones.scss',
})
export class TeminosCondiciones {
  
  // Inyectamos el servicio Location de Angular para manejar el historial
  private readonly viewportScroller = inject(ViewportScroller);

  lastUpdate = signal('Enero, 2026');

  private location = inject(Location);

  goBack(): void {
    this.location.back();
  }

}
