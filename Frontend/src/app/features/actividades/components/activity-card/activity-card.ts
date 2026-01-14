import { Component, EventEmitter, inject, Input, input, Output, output } from '@angular/core';
import { Router } from '@angular/router';

import { ActService } from '../../../../core/services/actividad/act-service';
import { ErrorService } from '../../../../core/services/error/error-service';
import { ActUpdateService } from '../../../../core/services/actividad/act-update-service';

import { ConfirmDialog } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageService, ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-activity-card',
  imports: [CardModule, ButtonModule, ConfirmDialog, MessageModule],
  providers: [ConfirmationService],
  templateUrl: './activity-card.html',
  styleUrl: './activity-card.scss',
})
export class ActivityCard {
  private actService = inject(ActService);
  private messageService = inject(MessageService);
  private errorService = inject(ErrorService);
  private actUpdateService = inject(ActUpdateService);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);

  titulo = input.required<string>();
  fecha = input.required<string>();
  hora = input.required<string>();
  ubicacion = input.required<string>();
  imagen = input<string>('');

  @Input() botonLabel!: string;
  @Input() botonStyle!: string;

  @Input() eliminarLabel?: string;
  @Input() eliminarStyle?: string;

  // Accept callbacks that optionally take an id. This lets parents pass either
  // a function that expects the id or a zero-arg lambda that captures it.
  @Input() botonAction?: (id: number) => void;
  @Input() actividadId!: number;

  handleButtonClick(tipo: 'boton' | 'eliminar' | 'reembolso-a-todos') {
    if (tipo === 'boton') {
      // Call the passed callback, if provided. Use optional chaining to be safe.
      this.botonAction?.(this.actividadId);
    } else if (tipo === 'eliminar') {
      this.confirmationService.confirm({
        target: event?.target as EventTarget,
        message: '¿Seguro que quieres eliminar esta actividad?',
        header: '¡Cuidado!',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancelar',
        rejectButtonProps: {
          label: 'Cancelar',
          severity: 'secondary',
          outlined: true,
        },
        acceptButtonProps: {
          label: 'Eliminar',
          severity: 'danger',
        },

        accept: () => {
          this.actService.deleteActividad(this.actividadId).subscribe({
            next: () => {
              console.log(this.actividadId);

              this.messageService.add({
                severity: 'success',
                summary: 'Oh... :(',
                detail: 'Actividad eliminada correctamente',
              });
              setTimeout(() => {
                this.actUpdateService.notifyUpdate();
              }, 2500); // espera 2.5 segundos para que se vea el toast
            },
            error: (codigo) => {
              const mensaje = this.errorService.getMensajeError(codigo);
              this.errorService.showError(mensaje);
            },
          });
        },
        reject: () => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Rechazado',
            detail: 'Has cancelado la eliminación',
          });
        },
      });
    } else {
      this.confirmationService.confirm({
        target: event?.target as EventTarget,
        message: '¿Seguro que quieres eliminar esta actividad? Esta actividad tiene un coste y al eliminarla se procederá al reembolso automático.',
        header: '¡Cuidado!',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancelar',
        rejectButtonProps: {
          label: 'Cancelar',
          severity: 'secondary',
          outlined: true,
        },
        acceptButtonProps: {
          label: 'Eliminar y reembolsar',
          severity: 'danger',
        },

        accept: () => {
          console.log('Reembolso de actividad', this.actividadId);
        },
        reject: () => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Rechazado',
            detail: 'Has cancelado la eliminación',
          });
        },
      });
    }
  }

  infoActividad() {
    return this.router.navigate([
      `/actividades/info-actividad/${this.actividadId}`,
    ]);
  }
}
