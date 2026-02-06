import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Header } from '../../../../core/layout/header/header';
import { Footer } from '../../../../core/layout/footer/footer';

@Component({
  selector: 'app-stripe-callback',
  imports: [Header, Footer],
  templateUrl: './stripe-callback.html',
  styleUrl: './stripe-callback.scss',
})
export class StripeCallback {
  private router = inject(Router);

  goToProfile() {
    return this.router.navigate([`/perfil`]);
  }

  
  goToCrearActividad() {
    return this.router.navigate([`/actividades/crear-actividad`]);
  }
}
