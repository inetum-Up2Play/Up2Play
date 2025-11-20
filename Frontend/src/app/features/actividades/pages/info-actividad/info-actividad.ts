import { Component, input, signal, inject } from '@angular/core';

import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { Rating } from 'primeng/rating';
import { InputIcon } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';

import { Actividad } from '../../../../core/models/Actividad';
import { ActService } from '../../../../core/services/actividad/act-service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-info-actividad',
  imports: [CommonModule, CardModule, DividerModule, Rating, InputIcon, FormsModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './info-actividad.html',
  styleUrl: './info-actividad.scss',
  providers: [MessageService]
})
export class InfoActividad {

  actividad = signal<Actividad | null>(null);

  private messageService = inject(MessageService);
  private actService = inject(ActService);

  constructor() {
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
          detail: e ?? 'No se pudo unir a la actividad'
        });
      }
    });
  }


  // Creo que aquí debería ir la lógica para según el deporte que sea, 
  // darle un valor al actividad.imagen distinto y así se muestre luego
  // switch (this.actividad.deporte) {
  // }
}
