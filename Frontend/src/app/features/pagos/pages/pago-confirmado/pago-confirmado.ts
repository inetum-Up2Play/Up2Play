import { Component, inject, Input, input, OnInit, signal } from '@angular/core';
import { Header } from '../../../../core/layout/header/header';
import { Footer } from '../../../../core/layout/footer/footer';
import { ActivatedRoute, Router } from '@angular/router';
import { ActService } from '../../../../core/services/actividad/act-service';
import { PagosService } from '../../../../core/services/pagos/pagos-service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-pago-confirmado',
  imports: [Header, Footer, CurrencyPipe, DatePipe],
  templateUrl: './pago-confirmado.html',
  styleUrl: './pago-confirmado.scss',
})
export class PagoConfirmado implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private pagosService = inject(PagosService);
  private actService = inject(ActService);

  titulo = input.required<string>();
  precio = input.required<string>();
  fecha = input.required<string>();
  hora = input.required<string>();
  ubicacion = input.required<string>();
  imagen = input<string>('');

  actividadResumen = signal<any>(null);
  procesandoInscripcion = signal(true);
  errorInscripcion = signal(false);

  @Input() actividadId!: number;

  ngOnInit() {
    // 1. Recuperamos la actividad a la que el usuario quiere apuntarse
    const actividadGuardada = this.pagosService.recuperarTransaccionPendiente();
    
    // Leemos el estado de Stripe
    const status = this.route.snapshot.queryParamMap.get('redirect_status');

    if (status === 'succeeded' && actividadGuardada?.actividadId) {
      
      // Seteamos los datos para que se vean en el HTML (Resumen)
      this.actividadResumen.set(actividadGuardada);
      
      // Inscribimos al usuario usando el ID recuperado del storage
      this.finalizarInscripcion(actividadGuardada.actividadId);

    } else {
      this.procesandoInscripcion.set(false);
      this.errorInscripcion.set(true);
      console.error('No se encontró transacción pendiente o el pago falló');
    }
  }

  private finalizarInscripcion(id: number) {
    this.actService.unirteActividad(id).subscribe({
      next: () => {
        this.procesandoInscripcion.set(false);
        this.pagosService.clear(); // Importante para limpiar el flujo de pagar
      },
      error: (err) => {
        this.procesandoInscripcion.set(false);
        this.errorInscripcion.set(true);
      }
    });
  }

  goToInfoActividad() {
    return this.router.navigate([`/actividades/info-actividad/${this.actividadId}`]);
  }

  goToInicio() {
    return this.router.navigate([`/`]);
  }

}
