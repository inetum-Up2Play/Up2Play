import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { StripeService } from '../../../../../core/services/pagos/stripe-service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-payment',
  imports: [ButtonModule, CurrencyPipe],
  templateUrl: './payment.html',
  styleUrl: './payment.scss',
  providers: [MessageService]
})
export class Payment {
  private stripeService = inject(StripeService);
  private messageService = inject(MessageService);

  // Referencia al div donde se monta el formulario de Stripe
  private cardElementRef = viewChild<ElementRef>('paymentElement');

  // Signals para controlar el estado
  loading = signal(false);
  stripeInstance: any;
  elements: any;
  paymentElement: any;

  // Estos datos deberían venir de la actividad seleccionada (ej. vía Input o un Shared Service)
  activityData = {
  amount: 1000, 
  currency: 'eur',
  connectedAccountId: 'acct_XXXXX',
  customerEmail: 'cliente@ejemplo.com',
  applicationFee: 0 // Añade esto, incluso si es 0
};

  async ngOnInit() {
    this.initPaymentFlow();
  }

  async initPaymentFlow() {
    this.loading.set(true);

    // 1. Obtener el clientSecret desde tu Backend
    this.stripeService.createPaymentIntent(this.activityData).subscribe({
      next: async (res) => {
        // 2. Inicializar Stripe con la cuenta del VENDEDOR (Direct Charge)
        this.stripeInstance = await this.stripeService.getStripe(this.activityData.connectedAccountId);
        
        if (this.stripeInstance && res.clientSecret) {
          // 3. Crear instancia de Elements con el clientSecret
          this.elements = this.stripeInstance.elements({ clientSecret: res.clientSecret });
          
          // 4. Crear y montar el Payment Element (incluye validaciones, estilos, etc.)
          this.paymentElement = this.elements.create('payment');
          this.paymentElement.mount(this.cardElementRef()?.nativeElement);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo inicializar el pago' });
        this.loading.set(false);
      }
    });
  }

  async controlPayment() {
    if (this.loading()) return;
    this.loading.set(true);

    // 5. Confirmar el pago
    const { error } = await this.stripeInstance.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      // Si hay error (ej. tarjeta rechazada), Stripe lo gestiona y te avisa
      this.messageService.add({ severity: 'error', summary: 'Error de pago', detail: error.message });
      this.loading.set(false);
    } else {
      // Si no hay error, Stripe redirige automáticamente a return_url
      ///pagos/pago-confirmado
    }
  }
}
