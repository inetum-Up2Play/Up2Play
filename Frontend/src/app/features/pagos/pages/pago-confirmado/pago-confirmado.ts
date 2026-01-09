import { Component, inject, Input, input } from '@angular/core';
import { Header } from '../../../../core/layout/header/header';
import { Footer } from '../../../../core/layout/footer/footer';
import { Router } from '@angular/router';
import { ActService } from '../../../../core/services/actividad/act-service';

@Component({
  selector: 'app-pago-confirmado',
  imports: [Header, Footer],
  templateUrl: './pago-confirmado.html',
  styleUrl: './pago-confirmado.scss',
})
export class PagoConfirmado {
  private router = inject(Router);
  private actService = inject(ActService);

  titulo = input.required<string>();
  precio = input.required<string>();
  fecha = input.required<string>();
  hora = input.required<string>();
  ubicacion = input.required<string>();
  imagen = input<string>('');

  @Input() actividadId!: number;

  goToInfoActividad() {

    return this.router.navigate([`/actividades/info-actividad/${this.actividadId}`]);

  }

  goToInicio() {

    return this.router.navigate([`/`]);

  }

}
