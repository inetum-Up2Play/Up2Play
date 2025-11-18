import { Component, input, signal } from '@angular/core';

import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { Rating } from 'primeng/rating';
import { InputIcon } from 'primeng/inputicon';

import { Actividad } from '../../../../core/models/Actividad';
import { ActService } from '../../../../core/services/actividad/act-service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-info-actividad',
  imports: [CardModule, DividerModule, Rating, InputIcon, FormsModule, ReactiveFormsModule],
  templateUrl: './info-actividad.html',
  styleUrl: './info-actividad.scss'
})
export class InfoActividad {

  actividad = signal<Actividad | null>(null);

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


  // Creo que aquí debería ir la lógica para según el deporte que sea, 
  // darle un valor al actividad.imagen distinto y así se muestre luego
  // switch (this.actividad.deporte) {
  // }
}
