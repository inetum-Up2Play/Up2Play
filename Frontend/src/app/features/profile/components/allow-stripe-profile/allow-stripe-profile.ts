import { Component, inject, input, signal } from '@angular/core';

import { MessageModule } from 'primeng/message';

import { StripeService } from '../../../../core/services/pagos/stripe-service';

@Component({
  selector: 'app-allow-stripe-profile',
  imports: [MessageModule],
  templateUrl: './allow-stripe-profile.html',
  styleUrl: './allow-stripe-profile.scss',
})
export class AllowStripeProfile {
  private stripeService = inject(StripeService);

  pagosHabilitados = input.required<boolean>();

  loading = signal(false);

  habilitarPagos() {
    this.loading.set(true);
    this.stripeService.getOnboardingLink().subscribe({
      next: (res) => {
        if (res.onboardingUrl) {
          window.location.href = res.onboardingUrl;
        }
      },
      error: () => this.loading.set(false),
    });
  }
}
