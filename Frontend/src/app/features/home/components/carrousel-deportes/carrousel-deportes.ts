import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';
import { ActService } from '../../../../core/services/actividad/act-service';
import { ActUpdateService } from '../../../../core/services/actividad/act-update-service';
import { ErrorService } from '../../../../core/services/error/error-service';
import { ActivityCard } from '../../../actividades/components/activity-card/activity-card';
import { DeporteImgPipe } from '../../../actividades/pipes/deporte-img-pipe';
import { EmptyActivities } from '../../../actividades/components/empty-activities/empty-activities';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrousel-deportes',
  imports: [MessageModule, Carousel, ButtonModule, ActivityCard, ToastModule, DeporteImgPipe, EmptyActivities, CommonModule, RouterModule],
  templateUrl: './carrousel-deportes.html',
  styleUrl: './carrousel-deportes.scss',
})
export class CarrouselDeportes {
  private actService = inject(ActService);
  private actUpdateService = inject(ActUpdateService);
  private messageService = inject(MessageService);
  private errorService = inject(ErrorService);
  private router = inject(Router);

  activities: any[] = [];
  deporteActual: string | null = null;

  ngOnInit() {
    
 const deporte = this.actUpdateService.getDeporte();

  if (this.deporteActual) {
    this.cargarPorDeporte(this.deporteActual);
  } else {
    this.cargarActividades();
  }

  this.actUpdateService.update$.subscribe(() => {
    if (this.deporteActual) {
      this.cargarPorDeporte(this.deporteActual);
    } else {
      this.cargarActividades();
    }
  });
    
  }

  private mezclarYLimitar(activities: any[], limite: number = 10): any[] {
  return activities
    .sort(() => Math.random() - 0.5) 
    .slice(0, limite);               
  }
  
  cargarActividades() {
    this.deporteActual = null;
    this.actUpdateService.setDeporte(null);

    this.actService.listarActividadesNoApuntadas().subscribe({
      next: data => {
        this.activities =  this.mezclarYLimitar(data,10);
        
      },
      error: err => {
        console.error('Error cargando actividades', err);
        this.activities = [];
      }
    });
  }

 

  cargarPorDeporte(deporte: string) {
    this.deporteActual = deporte;
    this.actUpdateService.setDeporte(deporte); 

    this.actService.listarActividadesPorDeporte(deporte).subscribe({
      next: data => {
        this.activities=data;

    },
    error: err => {
      this.activities = [];
      
    }
  });
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

  extraerHora(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[1].substring(0, 5) : '';
  }

  extraerFecha(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[0] : '';
  }

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
