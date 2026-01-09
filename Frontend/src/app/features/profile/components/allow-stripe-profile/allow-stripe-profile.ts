import { Component, inject, input, signal } from '@angular/core'; 
import { StripeService } from '../../../../core/services/pagos/stripe-service';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-allow-stripe-profile',
  imports: [MessageModule],
  templateUrl: './allow-stripe-profile.html',
  styleUrl: './allow-stripe-profile.scss',
})
export class AllowStripeProfile {

  private stripeService = inject(StripeService);

  // Recibimos el estado desde el padre (Perfil) usando signal inputs
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
      error: () => this.loading.set(false)
    });
  }
}