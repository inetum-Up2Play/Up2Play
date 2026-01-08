import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/stripe';

  getOnboardingLink(): Observable<{ success: boolean; onboardingUrl: string }> {
    return this.http.get<{ success: boolean; onboardingUrl: string }>(`${this.API_URL}/onboarding-link`);
  }

  checkStatus(): Observable<{ success: boolean; pagosHabilitados: boolean }> {
    return this.http.get<{ success: boolean; pagosHabilitados: boolean }>(`${this.API_URL}/check-status`);
  }
}