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
  private readonly API_URL = 'http://localhost:8081/api/stripe';
  private stripePromise = loadStripe(environment.stripePublicKey);

  /**Inicializa Stripe para Direct Charges.
  Envia el connectedAccountId para que Stripe encuentre el PaymentIntent en la cuenta del vendedor.*/
  async getStripe(connectedAccountId: string): Promise<Stripe | null> {
    return loadStripe(environment.stripePublicKey, {
      stripeAccount: connectedAccountId
    });
  }

  getOnboardingLink(): Observable<{ success: boolean; onboardingUrl: string }> {
    return this.http.get<{ success: boolean; onboardingUrl: string }>(`${this.API_URL}/onboarding-link`);
  }

  checkStatus(): Observable<{ success: boolean; pagosHabilitados: boolean }> {
    return this.http.get<{ success: boolean; pagosHabilitados: boolean }>(`${this.API_URL}/check-status`);
  }

  // En stripe-service.ts
  createPaymentIntent(paymentData: {
    amount: number,
    currency: string,
    connectedAccountId: string,
    customerEmail: string,
    applicationFee?: number
  }): Observable<any> {
    // Llamada al endpoint POST que definimos en el controlador de Java
    return this.http.post(`${this.API_URL}/payments/payment-intent`, paymentData);
  }

}