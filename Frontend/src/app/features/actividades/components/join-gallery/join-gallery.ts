import { Component, inject, OnInit } from '@angular/core';
import { ActivityCard } from '../activity-card/activity-card';
import { ActService } from '../../../../core/services/actividad/act-service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ErrorService } from '../../../../core/services/error/error-service';
import { ActUpdateService } from '../../../../core/services/actividad/act-update-service';


@Component({
  selector: 'app-join-gallery',
  imports: [ActivityCard, ButtonModule, ToastModule, MessageModule],
  templateUrl: './join-gallery.html',
  styleUrl: './join-gallery.scss'
})
export class JoinGallery implements OnInit {

  private actService = inject(ActService);
  private messageService = inject(MessageService);
  private errorService = inject(ErrorService);
  private actUpdateService = inject(ActUpdateService);
  
  activities: any[] = [];
  visibleActivities: any[] = [];
  pageSize = 8; // 4 por fila * 2 filas
  currentPage = 1;

  ngOnInit() {
    this.cargarActividades();

    //Recargar al recibir notificación (unirse/desunirse)
    this.actUpdateService.update$.subscribe(() => {
      this.cargarActividades();
    });
  }

  cargarActividades() {
    this.actService.listarActividadesNoApuntadas().subscribe({
      next: data => {
        this.activities = data;
        this.updateVisibleActivities();
      },
      error: err => {
        console.error('Error cargando actividades', err);
        this.activities = [];
      }
    });
  }

  updateVisibleActivities() {
    const start = 0;
    const end = this.pageSize * this.currentPage;
    this.visibleActivities = this.activities.slice(start, end);
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

  apuntarse(id: number) {
    this.actService.unirteActividad(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: '¡Enhorabuena!', detail: 'Te has unido a la actividad' });

        //bus de recarga de actividaedes
        this.actUpdateService.notifyUpdate();

        },
      error: (codigo) => {
        console.log('Código de error recibido:', codigo); // Debug
        const mensaje = this.errorService.getMensajeError(codigo);
        this.errorService.showError(mensaje);
      }
    });
  }


}
