import { Component, inject } from '@angular/core';
import { Header } from '../../../../core/layout/header/header';
import { Footer } from '../../../../core/layout/footer/footer';
import { Router } from '@angular/router';

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
