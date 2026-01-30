import { Component, inject, OnInit, signal } from '@angular/core';

import { MessageModule } from 'primeng/message';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

import { ActivityCard } from '../activity-card/activity-card';
import { DeporteImgPipe } from '../../pipes/deporte-img-pipe';
import { ActService } from '../../../../core/services/actividad/act-service';
import { ActUpdateService } from '../../../../core/services/actividad/act-update-service';
import { EmptyActivities } from '../empty-activities/empty-activities';

@Component({
  selector: 'app-joined-carousel',
  imports: [MessageModule, Carousel, ButtonModule, ActivityCard, ToastModule, DeporteImgPipe, EmptyActivities],
  templateUrl: './joined-carousel.html',
  styleUrl: './joined-carousel.scss'
})
export class JoinedCarousel implements OnInit {

  private actService = inject(ActService);
  private actUpdateService = inject(ActUpdateService);

  activities: any[] = [];

  ngOnInit() {
    this.cargarActividades();

    //Recargar al recibir notificación (unirse/desunirse)
    this.actUpdateService.update$.subscribe(() => {
      this.cargarActividades();
    });
  }

  cargarActividades() {
    this.actService.listarActividadesApuntadasPendientes().subscribe({
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

  extraerHora(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[1].substring(0, 5) : '';
  }

  extraerFecha(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[0] : '';
  }

  // Variables para configurar el responsive del carousel
  responsiveOptions = [
    {
      breakpoint: '1840px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '1200px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '992px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    }
  ];

}
