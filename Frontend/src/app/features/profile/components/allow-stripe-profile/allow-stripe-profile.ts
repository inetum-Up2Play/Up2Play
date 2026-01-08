import { Component, inject } from '@angular/core'; import { Pagos } from '../../../../core/services/pagos/pagos';

@Component({
  selector: 'app-allow-stripe-profile',
  imports: [],
  templateUrl: './allow-stripe-profile.html',
  styleUrl: './allow-stripe-profile.scss',
})
export class AllowStripeProfile {

  private pagos = inject(Pagos);

  iniciarOnboarding() {
    this.pagos.getStripeOnboardingUrl().subscribe({
      next: (url) => {
        window.location.href = url; // Rediriges al usuario
      },
      error: () => {
        alert('Ha fallado la generación del enlace. Inténtalo más tarde.');
      }
    });
  }
}
