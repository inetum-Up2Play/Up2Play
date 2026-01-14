import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';

import { ActivityCard } from '../activity-card/activity-card';
import { ActService } from '../../../../core/services/actividad/act-service';
import { ErrorService } from '../../../../core/services/error/error-service';
import { ActUpdateService } from '../../../../core/services/actividad/act-update-service';
import { PagosService } from '../../../../core/services/pagos/pagos-service';
import { EmptyActivities } from '../empty-activities/empty-activities';
import { DeporteImgPipe } from '../../pipes/deporte-img-pipe';
import { Actividad } from '../../../../shared/models/Actividad';
import { UserService } from '../../../../core/services/user/user-service';

@Component({
  selector: 'app-join-gallery',
  imports: [ActivityCard, ButtonModule, ToastModule, MessageModule, EmptyActivities, DeporteImgPipe],
  templateUrl: './join-gallery.html',
  styleUrl: './join-gallery.scss'
})

export class JoinGallery implements OnInit {
  actividad = signal<Actividad | null>(null);

  private router = inject(Router);
  private actService = inject(ActService);
  private messageService = inject(MessageService);
  private errorService = inject(ErrorService);
  private actUpdateService = inject(ActUpdateService);
  private pagosService = inject(PagosService);
  private userService = inject(UserService);

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
    // 1. Buscamos la actividad completa en nuestra lista local
    const act = this.activities.find(a => a.id === id);

    if (!act) return;

    const precioStr = act.precio ? act.precio.toString().replace(',', '.') : '0';
    const precioNumerico = parseFloat(precioStr);
    // COMPRUEBA SI ES DE PAGO
    if (!isNaN(precioNumerico) && precioNumerico > 0) {

      if (!act.usuarioCreadorId) {
        this.errorService.showError('No se puede identificar al creador de la actividad');
        return;
      }

      this.userService.getUsuarioPorId(act.usuarioCreadorId).subscribe({
        next: (creador) => {
          // Ya tenemos al usuario creador, verificamos su Stripe ID
          if (creador && creador.stripeAccountId) {

            // Todo correcto: Guardamos y navegamos
            this.pagosService.setActivity({
              actividadId: act.id,
              nombre: act.nombre,
              precio: precioNumerico,
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

      return; // Detenemos aquí para que no siga al flujo gratuito
    } else {
      // FLUJO GRATUITO 
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
  }

  pagar(id: number) {
    console.log('pagar');
  }


}


