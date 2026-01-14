import { Component, ElementRef, inject, signal, viewChild, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, JsonPipe, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';

import { StripeService } from '../../../../../core/services/pagos/stripe-service';
import { PagosService } from '../../../../../core/services/pagos/pagos-service';
import { UserDataService } from '../../../../../core/services/auth/user-data-service';
import { Header } from '../../../../../core/layout/header/header';
import { Footer } from '../../../../../core/layout/footer/footer';
import { DeporteImgPipe } from '../../../../actividades/pipes/deporte-img-pipe';

@Component({
  selector: 'app-payment',
  imports: [ButtonModule, CurrencyPipe, Header, Footer, DatePipe, ProgressSpinner, DeporteImgPipe, TitleCasePipe, JsonPipe],
  templateUrl: './payment.html',
  styleUrl: './payment.scss',
  providers: [MessageService]
})
export class Payment implements OnInit {
  private stripeService = inject(StripeService);
  private messageService = inject(MessageService);
  private pagosService = inject(PagosService);
  private userDataService = inject(UserDataService);
  private router = inject(Router);

  // Signals para controlar el estado
  loading = signal(false);
  actividad = signal<any>(null);
  stripeInstance: any;
  elements: any;

  // Referencia al div donde se monta el formulario de Stripe
  private paymentElementRef = viewChild<ElementRef>('paymentElement');

  // Propiedad de configuración de estilos para Stripe Elements
  private appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#3D6C3F',
      colorBackground: '#ffffff',
      colorText: '#152614',
      colorDanger: '#df1b41',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '12px',
    },
    rules: {
      '.Input': {
        border: '1px solid #e2e8f0',
        boxShadow: 'none',
      },
      '.Input:focus': {
        border: '1px solid #3D6C3F',
      }
    }
  };

  async ngOnInit() {
    const activity = this.pagosService.selectedActivity();

    // Seguridad: Si no hay actividad en el servicio, volvemos atrás
    if (!activity) {
      this.router.navigate(['/actividades']);
      return;
    }

    // NORMALIZACIÓN
    const activityData = { ...activity,
      // Convertimos el string de la base de datos a un objeto Date real
      fecha: activity.fecha ? new Date(activity.fecha) : null,
      // Aseguramos que el precio sea un número puro
      precio: Number(activity.precio)
    };

    this.actividad.set(activityData);
    this.iniciarFlujo(activityData);
  }

  private async iniciarFlujo(activity: any) {
    this.loading.set(true);

    // Calculamos el total en céntimos
    const amountCents = Math.round(activity.precio * 100);

    const payload = {
      amount: amountCents,
      currency: 'eur',
      connectedAccountId: activity.organizadorStripeId,
      customerEmail: this.userDataService.getEmail(),
      actividadId: activity.actividadId
    };

    this.stripeService.createPaymentIntent(payload).subscribe({
      next: async (res) => {
        // Inicializamos Stripe con la cuenta del vendedor
        this.stripeInstance = await this.stripeService.getStripe(activity.organizadorStripeId);

        if (this.stripeInstance && res.clientSecret) {
          // Corregido: 'appearance' (estaba como apperance)
          this.elements = this.stripeInstance.elements({ 
            clientSecret: res.clientSecret, 
            appearance: this.appearance 
          });
          
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

  // Método para cancelar el proceso y volver a la ficha de la actividad
  cancelar() {
    const id = this.actividad()?.actividadId;
    if (id) {
      this.router.navigate(['/actividades/info-actividad', id]);
    } else {
      this.router.navigate(['/actividades']);
    }
  }
}