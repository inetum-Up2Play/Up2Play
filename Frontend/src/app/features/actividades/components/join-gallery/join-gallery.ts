import { Component, inject, OnInit, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';

import { ActivityCard } from '../activity-card/activity-card';
import { ActService } from '../../../../core/services/actividad/act-service';
import { ErrorService } from '../../../../core/services/error/error-service';
import { ActUpdateService } from '../../../../core/services/actividad/act-update-service';
import { EmptyActivities } from '../empty-activities/empty-activities';
import { DeporteImgPipe } from '../../pipes/deporte-img-pipe';
import { Actividad } from '../../../../shared/models/Actividad';

@Component({
  selector: 'app-join-gallery',
  imports: [ActivityCard, ButtonModule, ToastModule, MessageModule, EmptyActivities, DeporteImgPipe],
  templateUrl: './join-gallery.html',
  styleUrl: './join-gallery.scss'
})

export class JoinGallery implements OnInit {
  actividad = signal<Actividad | null>(null);

  private actService = inject(ActService);
  private messageService = inject(MessageService);
  private errorService = inject(ErrorService);
  private actUpdateService = inject(ActUpdateService);

  activities: any[] = [];
  visibleActivities: any[] = [];
  pageSize = 8; // 4 por fila * 2 filas
  currentPage = 1;
  noHayActividades = true;


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

        if (this.activities.length != 0) {
          this.noHayActividades = false;
        }
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
