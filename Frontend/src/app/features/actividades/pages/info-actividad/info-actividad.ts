import { Component, signal, inject } from '@angular/core';

import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { RatingModule } from 'primeng/rating';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';

import { Actividad } from '../../../../core/models/Actividad';
import { ActService } from '../../../../core/services/actividad/act-service';
import { Header } from '../../../../core/layout/header/header';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-info-actividad',
  imports: [CardModule, DividerModule, RatingModule, InputIconModule, FormsModule, ReactiveFormsModule, Header],
  providers: [MessageService],
  templateUrl: './info-actividad.html',
  styleUrls: ['./info-actividad.scss']
})
export class InfoActividad {

  actividad = signal<Actividad | null>(null);

  messageService = inject(MessageService);

  constructor(private actService: ActService) {
    // Simulación: obtener actividad por ID
    this.actService.infoActividad(1).subscribe(act => {
      this.actividad.set(act); // Actualizamos la signal con la respuesta
      this.formRating.get('rating')?.setValue(this.getNivelValue(act.nivel)); //Actualizamos el rating según su nivel
    });
  }

  //Usamos el p-rating como un form
  formRating = new FormGroup({
    rating: new FormControl(0)
  });

  //Método para indicar las banderas según nivel
  getNivelValue(nivel: string): number {
    const map: Record<string, number> = {
      'Iniciado': 1,
      'Principiante': 2,
      'Intermedio': 3,
      'Avanzado': 4,
      'Experto': 5
    };
    return map[nivel] || 0; // Devuelve 0 si no coincide
  }

  unirse(idActividad: number): void {
    this.actService.unirteActividad(idActividad).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'OK',
          detail: 'Te has unido a la actividad'
        });
      },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: e.error?.message ?? 'No se pudo unir a la actividad'
        });
      }
    });
  }



  // Creo que aquí debería ir la lógica para según el deporte que sea, 
  // darle un valor al actividad.imagen distinto y así se muestre luego
  // switch (this.actividad.deporte) {
  // }
}
