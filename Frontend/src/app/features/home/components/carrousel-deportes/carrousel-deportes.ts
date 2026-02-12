import { ChangeDetectorRef, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { ActService } from '../../../../core/services/actividad/act-service';
import { ActUpdateService } from '../../../../core/services/actividad/act-update-service';
import { ErrorService } from '../../../../core/services/error/error-service';
import { ActivityCard } from '../../../actividades/components/activity-card/activity-card';
import { DeporteImgPipe } from '../../../actividades/pipes/deporte-img-pipe';
import { EmptyActivities } from '../../../actividades/components/empty-activities/empty-activities';
import { UserService } from '../../../../core/services/user/user-service';
import { PagosService } from '../../../../core/services/pagos/pagos-service';

@Component({
  selector: 'app-carrousel-deportes',
  standalone: true,
  imports: [
    CommonModule,
    Carousel,
    ButtonModule,
    ActivityCard,
    ToastModule,
    DeporteImgPipe,
    EmptyActivities,
    RouterModule,
  ],
  templateUrl: './carrousel-deportes.html',
  styleUrl: './carrousel-deportes.scss',
})
export class CarrouselDeportes implements OnInit, OnDestroy {
  // Servicios
  private actService = inject(ActService);
  private actUpdateService = inject(ActUpdateService);
  private messageService = inject(MessageService);
  private userService = inject(UserService);
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);
  private cdr = inject(ChangeDetectorRef);

  activities: any[] = [];

  private currentRequestId = 0;
  loading = false;
  private breakpointSubscription!: Subscription;
  mostrarIndicadores = true;


  responsiveOptions = [
    { breakpoint: '1840px', numVisible: 3, numScroll: 1 },
    { breakpoint: '1200px', numVisible: 2, numScroll: 1 },
    { breakpoint: '992px', numVisible: 2, numScroll: 1 },
    { breakpoint: '768px', numVisible: 1, numScroll: 1 },
  ];

  ngOnInit() {

    this.cargarActividades();


    this.breakpointSubscription = this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .subscribe(result => {
        this.mostrarIndicadores = !result.matches;
      });
  }

  ngOnDestroy() {
    this.breakpointSubscription?.unsubscribe();
  }


  deporteActual: string | null = null;


  cargarActividades(deporte?: string | null): void {

    this.loading = true;
    this.cdr.detectChanges();

    if (!deporte) {
      this.deporteActual = null;
    } else {
      this.deporteActual = deporte;
      this.actUpdateService.setDeporte(deporte);
    }

    const requestId = ++this.currentRequestId;
    const observable = deporte
      ? this.actService.listarActividadesPorDeporte(deporte)
      : this.actService.listarActividadesNoApuntadas();

    observable.subscribe({
      next: (data) => {
        if (requestId === this.currentRequestId) {

          if (deporte) {
            this.activities = data;
            if (data.length === 0) {
              this.messageService.add({
                severity: 'info',
                summary: 'Sin resultados',
                detail: `No hay actividades disponibles para ${deporte}`,
              });
            }
          } else {
            this.activities = this.mezclarYLimitar(data, 10);
          }


          this.loading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        if (requestId === this.currentRequestId) {
          this.activities = [];
          this.loading = false;
          this.cdr.detectChanges();

          if (deporte) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Error al cargar actividades de ${deporte}`,
            });
          }
        }
      }
    });
  }

  private mezclarYLimitar(activities: any[], limite: number = 10): any[] {
    if (!activities || activities.length === 0) return [];
    return [...activities].sort(() => Math.random() - 0.5).slice(0, limite);
  }

  get carouselClasses(): any {
    return {
      'single-item': this.activities.length === 1,
      'two-items': this.activities.length === 2,
      'three-or-more': this.activities.length >= 3,
    };
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