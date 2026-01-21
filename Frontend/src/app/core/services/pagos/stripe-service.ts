import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class StripeService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8082/api/stripe';

  /**Inicializa Stripe para Direct Charges.
  Envia el connectedAccountId para que Stripe encuentre el PaymentIntent en la cuenta del vendedor.*/
  async getStripe(connectedAccountId: string): Promise<Stripe | null> {
    return loadStripe(environment.stripePublicKey, {
      stripeAccount: connectedAccountId
    });
  }

  // Devuelve el link de registro en Stripe
  getOnboardingLink(): Observable<{ success: boolean; onboardingUrl: string }> {
    return this.http.get<{ success: boolean; onboardingUrl: string }>(`${this.API_URL}/onboarding-link`);
  }

  // Comprueba que el usuario se haya registrado en Stripe correctamente
  checkStatus(): Observable<{ success: boolean; pagosHabilitados: boolean }> {
    return this.http.get<{ success: boolean; pagosHabilitados: boolean }>(`${this.API_URL}/check-status`);
  }

  // Crea el intento de pago
  createPaymentIntent(paymentData: {
    amount: number,
    currency: string,
    connectedAccountId: string,
    customerEmail: string,
    applicationFee?: number
  }): Observable<any> {
    // Llamada al endpoint POST 
    return this.http.post(`${this.API_URL}/payments/payment-intent`, paymentData);
  }

}