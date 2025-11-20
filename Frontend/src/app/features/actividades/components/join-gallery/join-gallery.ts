import { Component, inject, OnInit } from '@angular/core';
import { ActivityCard } from '../activity-card/activity-card';
import { ActService } from '../../../../core/services/actividad/act-service';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-join-gallery',
  imports: [ActivityCard, ButtonModule],
  templateUrl: './join-gallery.html',
  styleUrl: './join-gallery.scss'
})
export class JoinGallery implements OnInit {

  private actService = inject(ActService);
  
  activities: any[] = [];
  visibleActivities: any[] = [];
  pageSize = 8; // 4 por fila * 2 filas
  currentPage = 1;

  ngOnInit() {
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





}
