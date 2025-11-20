import { Component, signal, inject } from '@angular/core';

import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { RatingModule } from 'primeng/rating';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';

import { Actividad } from '../../../../core/models/Actividad';
import { ActService } from '../../../../core/services/actividad/act-service';
import { Header } from '../../../../core/layout/header/header';
import { ErrorService } from '../../../../core/services/error/error-service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-info-actividad',
  imports: [CardModule, DividerModule, RatingModule, InputIconModule, FormsModule, ReactiveFormsModule, Header, ToastModule, MessageModule],
  templateUrl: './info-actividad.html',
  styleUrls: ['./info-actividad.scss']
})
export class InfoActividad {

  actividad = signal<Actividad | null>(null);
  apuntado = signal<boolean>(false);

  private messageService = inject(MessageService);
  private actService = inject(ActService);
  private errorService = inject(ErrorService);

  actividadId: number;

  constructor(private route: ActivatedRoute) {
    this.actividadId = Number(route.snapshot.paramMap.get("id"));
    // Simulación: obtener actividad por ID

    //this.actService.infoActividad(this.actividadId).subscribe(act => {
    // this.actividad.set(act); // Actualizamos la signal con la respuesta
    // this.formRating.get('rating')?.setValue(this.getNivelValue(act.nivel)); //Actualizamos el rating según su nivel
    // });
  }

  ngOnInit(): void {
    if (!this.actividadId || Number.isNaN(this.actividadId)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'ID de actividad inválido'
      });
      return;
    }

    this.actService.getActividad(this.actividadId).subscribe({
      next: act => {
        this.actividad.set(act); // Actualizamos la signal con la respuesta
        this.formRating.get('rating')?.setValue(this.getNivelValue(act.nivel)); //Actualizamos el rating según su nivel
      },
      error: e => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: e ?? 'No se pudo cargar la actividad'
        });
      }
    });
    // Consultar si el usuario está apuntado
    this.actService.estoyApuntado(this.actividadId).subscribe(flag => this.apuntado.set(flag));
  }

  //Usamos el p-rating como un form
  formRating = new FormGroup({
    rating: new FormControl(0)
  });

  //Método para indicar las banderas según nivel
  getNivelValue(nivel: string): number {
    const map: Record<string, number> = {
      'INICIADO': 1,
      'PRINCIPIANTE': 2,
      'INTERMEDIO': 3,
      'AVANZADO': 4,
      'EXPERTO': 5
    };
    return map[nivel] || 0; // Devuelve 0 si no coincide
  }
  extraerHora(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[1].substring(0, 5) : '';
  }

  extraerFecha(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[0] : '';
  }

  // Imagen por deporte
  /*   getImagenPorDeporte(deporte?: string): string {
      const map: Record<string, string> = {
        'Fútbol': 'assets/img/futbol.jpg',
        'Tenis': 'assets/img/tenis.jpg',
        'Basket': 'assets/img/basket.jpg'
      };
      return deporte ? (map[deporte] || 'assets/img/default.jpg') : 'assets/img/default.jpg';
    } */

  unirse(): void {
    const act = this.actividad();
    if (!act?.id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Actividad no cargada'
      });
      return;
    }

    this.actService.unirteActividad(act.id).subscribe({
      next: () => {
        // Actualización
        this.actividad.set({
          ...act,
          numPersInscritas: (act.numPersInscritas ?? 0) + 1
        });
        this.apuntado.set(true);

        this.messageService.add({ severity: 'success', summary: '¡Enhorabuena!', detail: 'Te has unido a la actividad' });
      },
      error: (codigo) => {
        console.log('Código de error recibido:', codigo); // Debug
        const mensaje = this.errorService.getMensajeError(codigo);
        this.errorService.showError(mensaje);
      }
    });
  }

  desapuntarse(): void {
    const act = this.actividad();
    if (!act) return;

    this.actService.desapuntarseActividad(this.actividadId).subscribe({
      next: () => {
        const nuevosInscritos = Math.max(Number(act.numPersInscritas ?? 0) - 1, 0);
        this.actividad.set({ ...act, numPersInscritas: nuevosInscritos });

        this.messageService.add({ severity: 'info', summary: 'Vaya...', detail: 'Te has desapuntado de la actividad' });
        this.apuntado.set(false);
      },
      error: (codigo) => {
        const mensaje = this.errorService.getMensajeError(codigo);
        this.errorService.showError(mensaje);
      }
    });
  }

  // Creo que aquí debería ir la lógica para según el deporte que sea, 
  // darle un valor al actividad.imagen distinto y así se muestre luego
  // switch (this.actividad.deporte) {
  // }
}
