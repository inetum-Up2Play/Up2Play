import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Header } from '../../../../core/layout/header/header';
import { Footer } from '../../../../core/layout/footer/footer';

@Component({
  selector: 'app-pago-denegado',
  imports: [Header, Footer],
  templateUrl: './pago-denegado.html',
  styleUrl: './pago-denegado.scss',
})
export class PagoDenegado {
  private router = inject(Router);

  openSupport() {
    window.open('https://support.stripe.com/?referrerLocale=es-es', '_blank', 'noopener,noreferrer');
  }

  goToInfoActividad() {
      this.router.navigate(['/actividades']);
  }

}
