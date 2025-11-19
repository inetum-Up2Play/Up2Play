import { Component, input } from '@angular/core';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-activity-card',
  imports: [CardModule, ButtonModule],
  templateUrl: './activity-card.html',
  styleUrl: './activity-card.scss'
})

export class ActivityCard {
  titulo = input<string>();
  fecha = input<string>();
  hora = input<string>();
  ubicacion = input<string>();
  imagen = input<string>();

  click() {
    //Código de cuando clickas en apuntarte a una actividad
  }
}
