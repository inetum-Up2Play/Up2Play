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

  // Accept callbacks that optionally take an id. This lets parents pass either
  // a function that expects the id or a zero-arg lambda that captures it.
  @Input() botonAction?: (id: number) => void;
  @Input() actividadId!: number;

  handleButtonClick() {
    // Call the passed callback, if provided. Use optional chaining to be safe.
    this.botonAction?.(this.actividadId);
    console.log('Botón clickeado con id:', this.actividadId);
  }

  infoActividad() {
    
    console.log('Información de la actividad con id:', this.actividadId);

    return this.router.navigate([`/actividades/info-actividad/${this.actividadId}`]);

  }

}
