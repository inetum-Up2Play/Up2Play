import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Pagos {
  private readonly http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://localhost:8080/pagos';

  getStripeOnboardingUrl(): Observable<string> {
    const payload = {
      returnUrl: `${window.location.origin}/onboarding/return`,
      refreshUrl: `${window.location.origin}/onboarding/refresh`,
    };

    return this.http
      .post<{ onboardingUrl: string }>(
        `${this.baseUrl}/stripe/connect/onboarding-link`,
        payload
      )
      .pipe(
        // Extraemos solo la URL
        map((resp) => {
          if (!resp?.onboardingUrl) {
            throw new Error('No se recibió la URL de onboarding.');
          }
          return resp.onboardingUrl;
        })
      );
  }

}
