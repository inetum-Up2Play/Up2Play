import { Component, EventEmitter, inject, Input, input, Output, output } from '@angular/core';
import { Router } from '@angular/router';

// --- Servicios Propios ---
import { ActService } from '../../../../core/services/actividad/act-service';
import { ErrorService } from '../../../../core/services/error/error-service';
import { ActUpdateService } from '../../../../core/services/actividad/act-update-service';

// --- PrimeNG Imports ---
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-activity-card',
  imports: [CardModule, ButtonModule, ConfirmDialog, MessageModule],
  providers: [ConfirmationService],
  templateUrl: './activity-card.html',
  styleUrl: './activity-card.scss',
})
export class ActivityCard {
  // --- Inyecciones ---
  private actService = inject(ActService);
  private messageService = inject(MessageService);
  private errorService = inject(ErrorService);
  private actUpdateService = inject(ActUpdateService);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);

  // --- Inputs (Signals) ---
  titulo = input.required<string>();
  fecha = input.required<string>();
  hora = input.required<string>();
  ubicacion = input.required<string>();
  imagen = input<string>('');

  // --- Inputs (Decoradores - Manteniendo consistencia con tu código) ---
  @Input() botonLabel!: string;
  @Input() botonStyle!: string;

  @Input() eliminarLabel?: string;
  @Input() eliminarStyle?: string;

  // Callback opcional
  @Input() botonAction?: (id: number) => void;
  @Input() actividadId!: number;

  /**
   * Maneja los clicks de los botones.
   * NOTA: Asegúrate de pasar '$event' desde el HTML si quieres que el popup salga junto al botón.
   * Ejemplo: (click)="handleButtonClick('eliminar', $event)"
   */
  handleButtonClick(tipo: 'boton' | 'eliminar' | 'reembolso-a-todos', event?: Event) {
    
    // CASO 1: Botón de acción principal (Detalles, Unirse, etc.)
    if (tipo === 'boton') {
      this.botonAction?.(this.actividadId);
      return;
    } 
    
    // CASO 2: Eliminar (Estándar)
    if (tipo === 'eliminar') {
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
          this.ejecutarEliminacion();
        },
        reject: () => {
          this.mensajeCancelado();
        },
      });
      return;
    } 
    
    // CASO 3: Eliminar con Reembolso (Pago)
    // 'reembolso-a-todos'
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
        // Aquí deberías llamar a la lógica de borrado real.
        // Si el backend gestiona el reembolso al borrar, llamamos a ejecutarEliminacion().
        // Si no, descomenta el log y pon tu lógica específica.
        // console.log('Reembolso de actividad', this.actividadId);
        
        this.ejecutarEliminacion(); 
      },
      reject: () => {
        this.mensajeCancelado();
      },
    });
  }

  // --- Lógica Auxiliar ---

  private ejecutarEliminacion() {
    this.actService.deleteActividad(this.actividadId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Oh... :(',
          detail: 'Actividad eliminada correctamente',
        });
        setTimeout(() => {
          this.actUpdateService.notifyUpdate();
        }, 2500);
      },
      error: (codigo) => {
        const mensaje = this.errorService.getMensajeError(codigo);
        this.errorService.showError(mensaje);
      },
    });
  }

  private mensajeCancelado() {
    this.messageService.add({
      severity: 'warn',
      summary: 'Rechazado',
      detail: 'Has cancelado la eliminación',
    });
  }

  infoActividad() {
    return this.router.navigate([
      `/actividades/info-actividad/${this.actividadId}`,
    ]);
  }
}