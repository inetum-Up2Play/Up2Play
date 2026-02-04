import { Component, HostListener, inject, input } from '@angular/core';
import { ActService } from '../../../../core/services/actividad/act-service';
import { ActUpdateService } from '../../../../core/services/actividad/act-update-service';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { EmptyActivities } from '../empty-activities/empty-activities';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ActivityCard } from '../activity-card/activity-card';
import { DeporteImgPipe } from '../../pipes/deporte-img-pipe';
import { ToastModule } from 'primeng/toast';
import { Observable } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ErrorService } from '../../../../core/services/error/error-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-gallery',
  imports: [
    EmptyActivities,
    CommonModule,
    MessageModule,
    ButtonModule,
    DataViewModule,
    SelectButtonModule,
    FormsModule,
    ActivityCard,
    ToastModule,
    DeporteImgPipe,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './card-gallery.html',
  styleUrl: './card-gallery.scss',
})
export class CardGallery {
  private actService = inject(ActService);
  private actUpdateService = inject(ActUpdateService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private errorService = inject(ErrorService);
  private router = inject(Router);

  private manejarError(codigo: number) {
    const mensaje = this.errorService.getMensajeError(codigo);
    this.errorService.showError(mensaje);
  }

  tipo = input.required<string>();

  // Configuración del DataView
  layout: 'list' | 'grid' = 'grid';
  options: any[] = ['list', 'grid'];

  activities: any[] = [];
  visibleActivities: any[] = [];
  actividadId!: number;

  pageSize = 8;
  currentPage = 1;
  noHayActividades = true;

  ngOnInit() {
    this.calcularPageSize();
    this.cargarActividades();

    // Suscribirse a cambios externos (ej: al borrar/crear una actividad)
    this.actUpdateService.update$.subscribe(() => {
      this.cargarActividades();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calcularPageSize();
  }

  calcularPageSize() {
    const width = window.innerWidth;
    let nuevoSize = 8;

    if (width >= 1536) {
      nuevoSize = 8;
    } else if (width >= 1280) {
      nuevoSize = 9; // Ajuste para pantallas grandes
    } else {
      nuevoSize = 8;
    }

    // Solo actualizamos si cambia el tamaño 
    if (this.pageSize !== nuevoSize) {
      this.pageSize = nuevoSize;
      if (this.activities.length > 0) {
        this.updateVisibleActivities();
      }
    }
  }

  cargarActividades() {
    this.currentPage = 1;
    this.noHayActividades = true;


    let llamarservicio: Observable<any[]>;

    switch (this.tipo()) {
      case 'explora-apuntate':
        llamarservicio = this.actService.listarActividadesNoApuntadas();
        break;
      case 'mis-actividades':
        llamarservicio = this.actService.listarActividadesCreadas();
        break;
      case 'proximos-planes':
        llamarservicio = this.actService.listarActividadesApuntadasPendientes();
        break;
      default:
        console.warn('Tipo de galería desconocido:', this.tipo());
        return;
    }

    llamarservicio.subscribe({
      next: (data) => {
        this.activities = data;
        this.noHayActividades = this.activities.length === 0;
        this.updateVisibleActivities();
      },
      error: (err) => {
        console.error('Error cargando actividades:', err);
        this.activities = [];
        this.visibleActivities = [];
        this.noHayActividades = true;
      },
    });
  }

  eliminar(event: Event, id: number) {

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message:
        '¿Seguro que quieres eliminar esta actividad? Si es de pago, se procederá al reembolso.',
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
        this.actService.deleteActividad(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Actividad eliminada',
              detail: 'Actividad eliminada correctamente',
            });
            setTimeout(() => {
              this.router.navigate(['/actividades']);
            }, 2500);
          },
          error: (codigo) => this.manejarError(codigo),
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
  }

  updateVisibleActivities() {
    // Lógica para "Mostrar más": muestra desde el 0 hasta el límite actual
    const end = this.pageSize * this.currentPage;
    this.visibleActivities = this.activities.slice(0, end);
  }

  loadMore() {
    this.currentPage++;
    this.updateVisibleActivities();
  }

  extraerHora(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[1].substring(0, 5) : '';
  }

  extraerFecha(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[0] : '';
  }

  redirigirInfoActividad(id: number | string) {
    return this.router.navigate(['/actividades/info-actividad', id]);
  }
}
