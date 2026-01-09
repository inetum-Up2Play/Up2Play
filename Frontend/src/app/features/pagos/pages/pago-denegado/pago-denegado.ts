import { Component } from '@angular/core';
import { Header } from '../../../../core/layout/header/header';
import { Footer } from '../../../../core/layout/footer/footer';


@Component({
  selector: 'app-pago-denegado',
  imports: [Header, Footer],
  templateUrl: './pago-denegado.html',
  styleUrl: './pago-denegado.scss',
})
export class PagoDenegado {
  
  openSupport() {
  window.open('https://support.stripe.com/?referrerLocale=es-es', '_blank', 'noopener,noreferrer');
}

}
