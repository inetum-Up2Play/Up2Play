import { Component, input, output } from '@angular/core';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-activity-card',
  imports: [CardModule, ButtonModule],
  templateUrl: './activity-card.html',
  styleUrl: './activity-card.scss'
})

export class ActivityCard {

  titulo = input.required<string>();
  fecha = input.required<string>();
  hora = input.required<string>();
  ubicacion = input.required<string>();
  imagen = input<string>('');

  // Preparar evento al hacer click en "Unirse" i que el componente padre lo pueda capturar
  join = output<void>();

  //Botón ejecuta el join
  click() {
    this.join.emit();
  }
}
