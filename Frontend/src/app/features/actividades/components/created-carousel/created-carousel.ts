import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MessageModule } from 'primeng/message';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

import { ActService } from '../../../../core/services/actividad/act-service';
import { ActUpdateService } from '../../../../core/services/actividad/act-update-service';
import { ActivityCard } from '../activity-card/activity-card';
import { DeporteImgPipe } from '../../pipes/deporte-img-pipe';
import { EmptyActivities } from '../empty-activities/empty-activities';


@Component({
  selector: 'app-created-carousel',
  imports: [MessageModule, Carousel, ButtonModule, ActivityCard, ToastModule, DeporteImgPipe, EmptyActivities],
  templateUrl: './created-carousel.html',
  styleUrl: './created-carousel.scss'
})
export class CreatedCarousel implements OnInit {

  private actService = inject(ActService);
  private actUpdateService = inject(ActUpdateService);
  private router = inject(Router);

  activities: any[] = [];


  ngOnInit() {
    this.cargarActividades();

    //Recargar al recibir notificación (unirse/desunirse)
    this.actUpdateService.update$.subscribe(() => {
      this.cargarActividades();
    });
  }

  cargarActividades() {
    this.actService.listarActividadesCreadas().subscribe({
      next: data => {
        this.activities = data;
      },
      error: err => {
        console.error('Error cargando actividades', err);
        this.activities = [];
      }
    });
  }

  editar(id: number) {
    return this.router.navigate([`/actividades/editar-actividad/${id}`]);
  }

  extraerHora(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[1].substring(0, 5) : '';
  }

  extraerFecha(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[0] : '';
  }

  // Responsive del carousel
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
