import { Routes } from '@angular/router';

import { PagoConfirmado } from './pages/pago-confirmado/pago-confirmado';
import { PagoDenegado } from './pages/pago-denegado/pago-denegado';
import { StripeCallback } from './pages/stripe-callback/stripe-callback';
import { Payment } from './pages/payment/payment/payment';
import { HistorialPagos } from './pages/historial-pagos/historial-pagos';

export const PAY_ROUTES: Routes = [
  {
    path: 'pago-confirmado',
    component: PagoConfirmado,
  },
  {
    path: 'pago-denegado',
    component: PagoDenegado,
  },
  {
    path: 'stripe-callback',
    component: StripeCallback,
  },
  {
    path: 'pago',
    component: Payment
  },
  {
    path: 'historial-pagos',
    component: HistorialPagos,
  }
];