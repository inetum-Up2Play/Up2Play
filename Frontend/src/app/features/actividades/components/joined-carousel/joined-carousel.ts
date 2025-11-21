import { Component, inject, OnInit, signal } from '@angular/core';
import { ActService } from '../../../../core/services/actividad/act-service';
import { ActUpdateService } from '../../../../core/services/actividad/act-update-service';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ErrorService } from '../../../../core/services/error/error-service';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { ActivityCard } from '../activity-card/activity-card';
import { ToastModule } from 'primeng/toast';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-joined-carousel',
  imports: [MessageModule, Carousel, ButtonModule, Tag, ActivityCard, ToastModule],
  templateUrl: './joined-carousel.html',
  styleUrl: './joined-carousel.scss'
})
export class JoinedCarousel implements OnInit {

  private actService = inject(ActService);
  private actUpdateService = inject(ActUpdateService);
  private messageService = inject(MessageService);
  private errorService = inject(ErrorService);

  activities: any[] = [];
    
  ngOnInit() {
    this.cargarActividades();

    //Recargar al recibir notificación (unirse/desunirse)
    this.actUpdateService.update$.subscribe(() => {
      this.cargarActividades();
    });
  }
    
  cargarActividades() {
    this.actService.listarActividadesApuntadas().subscribe({
      next: data => {
        this.activities = data;
        //Creo la propiedad esCreador en cada actividad
        this.activities.forEach(act => {
          this.actService.comprobarCreador(act.id).subscribe(flag => act.esCreador = flag);
        });

      },
      error: err => {
        console.error('Error cargando actividades', err);
        this.activities = [];
      }
    });
  }

  desapuntarse(id: number) {
    this.actService.desapuntarseActividad(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'info', summary: 'Vaya...', detail: 'Te has desapuntado de la actividad' });

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

  editar(id: number) {


  }

  extraerHora(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[1].substring(0, 5) : '';
  }
  
  extraerFecha(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[0] : '';
  }



}
