import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

import { StripeService } from '../../../../../core/services/pagos/stripe-service';
import { PagosService } from '../../../../../core/services/pagos/pagos-service';
import { UserDataService } from '../../../../../core/services/auth/user-data-service';
import { Header } from '../../../../../core/layout/header/header';
import { Footer } from '../../../../../core/layout/footer/footer';

@Component({
  selector: 'app-payment',
  imports: [ButtonModule, CurrencyPipe, Header, Footer],
  templateUrl: './payment.html',
  styleUrl: './payment.scss',
  providers: [MessageService]
})

export class Payment {
  private stripeService = inject(StripeService);
  private messageService = inject(MessageService);
  private pagosService = inject(PagosService);
  private userDataService = inject(UserDataService);
  private router = inject(Router);

  // Referencia al div donde se monta el formulario de Stripe
  private paymentElementRef = viewChild<ElementRef>('paymentElement');

  // Signals para controlar el estado
  loading = signal(false);
  actividad = signal<any>(null);
  stripeInstance: any;
  elements: any;

  async ngOnInit() {
    const activity = this.pagosService.selectedActivity();

    // Seguridad: Si no hay actividad en el servicio, volvemos atrás
    if (!activity) {
      this.router.navigate(['/actividades']);
      return;
    }
    this.actividad.set(activity);

    this.iniciarFlujo(activity);
  }

  private async iniciarFlujo(activity: any) {
    this.loading.set(true);

    // Calculamos el total en céntimos redondeando para evitar decimales
    const amountCents = Math.round(activity.precio * 100);

    const payload = {
      amount: amountCents, // Céntimos
      currency: 'eur',
      connectedAccountId: activity.organizadorStripeId,
      customerEmail: this.userDataService.getEmail(),
      actividadId: activity.actividadId
    };

    this.stripeService.createPaymentIntent(payload).subscribe({
      next: async (res) => {
        // Inicializamos Stripe con la cuenta del vendedor (Direct Charge)
        this.stripeInstance = await this.stripeService.getStripe(activity.organizadorStripeId);

        if (this.stripeInstance && res.clientSecret) {
          this.elements = this.stripeInstance.elements({ clientSecret: res.clientSecret });
          const paymentElement = this.elements.create('payment');
          // Montamos el elemento en el DOM
          const elem = this.paymentElementRef()?.nativeElement;
          if (elem) {
            paymentElement.mount(elem);
          }
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Fallo al cargar pasarela' });
        this.loading.set(false);
      }
    });
  }

  async confirmarPago() {
    this.loading.set(true);
    const activity = this.actividad();

    this.pagosService.guardarTransaccionPendiente(activity);

    const { error } = await this.stripeInstance.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: `${window.location.origin}/pagos/pago-confirmado`,
      },
    });

    if (error) {
      this.messageService.add({ severity: 'error', summary: 'Pago fallido', detail: error.message });
      this.loading.set(false);
    }
  }
}
