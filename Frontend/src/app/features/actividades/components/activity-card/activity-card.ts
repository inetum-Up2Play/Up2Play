import { Component, EventEmitter, inject, Input, input, Output, output } from '@angular/core';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ActService } from '../../../../core/services/actividad/act-service';
import { ErrorService } from '../../../../core/services/error/error-service';
import { MessageService } from 'primeng/api';
import { ActUpdateService } from '../../../../core/services/actividad/act-update-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity-card',
  imports: [CardModule, ButtonModule],
  templateUrl: './activity-card.html',
  styleUrl: './activity-card.scss'
})

export class ActivityCard {

  private actService = inject(ActService);
  private messageService = inject(MessageService);
  private errorService = inject(ErrorService);
  private actUpdateService = inject(ActUpdateService);  
  private router = inject(Router);


  titulo = input.required<string>();
  fecha = input.required<string>();
  hora = input.required<string>();
  ubicacion = input.required<string>();
  imagen = input<string>('');

  @Input() botonLabel!: string;
  @Input() botonStyle!: string;

  @Input() botonAction!: (id: number) => void;
  @Input() actividadId!: number;

  handleButtonClick() {
    if (this.botonAction) {
      this.botonAction(this.actividadId);
      console.log('Botón clickeado con id:', this.actividadId);
    }
  }

  infoActividad() {
    
    console.log('Información de la actividad con id:', this.actividadId);

    return this.router.navigate([`/actividades/info-actividad/${this.actividadId}`]);

  }

}
