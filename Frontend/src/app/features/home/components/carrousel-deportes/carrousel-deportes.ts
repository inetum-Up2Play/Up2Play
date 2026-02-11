import { ChangeDetectorRef, Component, inject } from '@angular/core';
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
import { UserService } from '../../../../core/services/user/user-service';
import { PagosService } from '../../../../core/services/pagos/pagos-service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-carrousel-deportes',
  imports: [MessageModule, Carousel, ButtonModule, ActivityCard, ToastModule, DeporteImgPipe, EmptyActivities, CommonModule, RouterModule],
  templateUrl: './carrousel-deportes.html',
  styleUrl: './carrousel-deportes.scss',
})
export class CarrouselDeportes {
  private breakpointObserver = inject(BreakpointObserver);
  private actService = inject(ActService);
  private actUpdateService = inject(ActUpdateService);
  private messageService = inject(MessageService);
  private errorService = inject(ErrorService);
  private userService = inject(UserService);
  private pagosService = inject(PagosService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  mostrarIndicadores = true;
  activities: any[] = [];
  deporteActual: string | null = null;
  private deporteSubscription: Subscription | undefined;
  isLoading = false;



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

    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .subscribe(result => {
        this.mostrarIndicadores = !result.matches;
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
        this.activities = this.mezclarYLimitar(data, 10);
        this.isLoading = false;
        this.cdr.detectChanges();

      },
      error: err => {
        console.error('Error cargando actividades', err);
        this.activities = [];
        this.cdr.detectChanges();
      }
    });
  }



  cargarPorDeporte(deporte: string) {
    this.deporteActual = deporte;
    this.actUpdateService.setDeporte(deporte);
    this.isLoading = true;

    // Cancela la suscripción anterior si existe
    if (this.deporteSubscription) {
      this.deporteSubscription.unsubscribe();
    }

    this.deporteSubscription = this.actService.listarActividadesPorDeporte(deporte).subscribe({
      next: data => {
        this.activities = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // Forzar detección de cambios

        // Si no hay datos, mostrar mensaje
        if (data.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'Sin resultados',
            detail: `No hay actividades disponibles para ${deporte}`
          });
        }
      },
      error: err => {
        console.error(`Error cargando actividades de ${deporte}`, err);
        this.activities = [];
        this.isLoading = false;
        this.cdr.detectChanges();

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Error al cargar actividades de ${deporte}`
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.deporteSubscription) {
      this.deporteSubscription.unsubscribe();
    }
  }

  get carouselClasses(): any {
    return {
      'single-item': this.activities.length === 1,
      'two-items': this.activities.length === 2,
      'three-or-more': this.activities.length >= 3
    };
  }

  pagar(id: number) {
    const act = this.activities.find(a => a.id === id);

    if (!act) return;

    this.userService.getUsuarioPorId(act.usuarioCreadorId).subscribe({
      next: (creador) => {
        // Ya tenemos al usuario creador, verificamos su Stripe ID
        if (creador && creador.stripeAccountId) {

          // Todo correcto: Guardamos y navegamos
          this.pagosService.setActivity({
            actividadId: act.id,
            nombre: act.nombre,
            precio: act.precio,
            organizadorStripeId: creador.stripeAccountId,
            deporte: act.deporte,
            fecha: act.fecha,
            ubicacion: act.ubicacion
          });

          this.router.navigate(['/pagos/pago']);

        } else {
          // El creador existe, pero no tiene pagos configurados
          this.messageService.add({
            severity: 'error',
            summary: 'Error de Pago',
            detail: 'El organizador no tiene configurada su cuenta para recibir pagos.'
          });
        }
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo contactar con el servidor para verificar al organizador.'
        });
      }
    });
  }

  apuntarse(id: number) {
    const act = this.activities.find(a => a.id === id);

    if (!act) return;

    this.actService.unirteActividad(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: '¡Enhorabuena!',
          detail: 'Te has unido a la actividad'
        });
        // Bus de recarga de actividaedes
        this.actUpdateService.notifyUpdate();
      },
      error: (codigo) => {
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

  actCompleta(): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Atención',
      detail: 'La actividad ya ha alcanzado el número máximo de inscritos.',
    });
  }
}