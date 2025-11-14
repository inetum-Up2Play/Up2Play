import { Component, input, signal } from '@angular/core';

import { CardModule } from 'primeng/card';
import { Actividad } from '../../../../core/models/Actividad';
import { ActService } from '../../../../core/services/actividad/act-service';

@Component({
  selector: 'app-info-actividad',
  imports: [CardModule],
  templateUrl: './info-actividad.html',
  styleUrl: './info-actividad.scss'
})
export class InfoActividad {
  actividad = signal<Actividad | null>(null);

  constructor(private actService: ActService) {
    // Simulación: obtener actividad por ID
    this.actService.infoActividad(1).subscribe(data => {
      this.actividad.set(data); // Actualizamos la signal con la respuesta
    });
  }
}
