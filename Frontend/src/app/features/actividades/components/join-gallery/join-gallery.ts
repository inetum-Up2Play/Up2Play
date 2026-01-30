import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
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
  styleUrl: './join-gallery.scss',
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
  pageSize = 8;
  currentPage = 1;
  noHayActividades = true;

  ngOnInit() {
    this.calcularPageSize();

    this.cargarActividades();

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
    }
    else if (width >= 1280) {
      nuevoSize = 9;
    }
    else {
      nuevoSize = 8;
    }
    if (this.pageSize !== nuevoSize) {
      this.pageSize = nuevoSize;
      if (this.activities.length > 0) {
        this.updateVisibleActivities();
      }
    }
  }

  cargarActividades() {
    this.actService.listarActividadesNoApuntadas().subscribe({
      next: (data) => {
        this.activities = data;
        this.updateVisibleActivities();

        if (this.activities.length != 0) {
          this.noHayActividades = false;
        }
      },
      error: (err) => {
        console.error('Error cargando actividades', err);
        this.activities = [];
      },
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

}