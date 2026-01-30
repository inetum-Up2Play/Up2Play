import { Component, inject, OnInit } from '@angular/core';


import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

import { ActService } from '../../../../core/services/actividad/act-service';
import { ActUpdateService } from '../../../../core/services/actividad/act-update-service';
import { ActivityCard } from '../activity-card/activity-card';
import { DeporteImgPipe } from '../../pipes/deporte-img-pipe';
import { EmptyActivities } from '../empty-activities/empty-activities';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-created-carousel',
  imports: [CommonModule, MessageModule, ButtonModule, DataViewModule, SelectButtonModule, FormsModule, ActivityCard, ToastModule, DeporteImgPipe, EmptyActivities],
  templateUrl: './created-carousel.html',
  styleUrl: './created-carousel.scss'
})
export class CreatedCarousel implements OnInit {

private actService = inject(ActService);
  private actUpdateService = inject(ActUpdateService);

  // Variables de datos
  activities: any[] = [];

  // Variables de configuración del DataView
  layout: 'list' | 'grid' = 'grid'; // Por defecto en cuadrícula
  options: any[] = ['list', 'grid'];

  ngOnInit() {
    this.cargarActividades();

    // Recargar al recibir notificación (unirse/desunirse)
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

/*   // Nota: Si pasas esta función al hijo, asegúrate de que el 'this' no se pierda.
  // A veces es mejor usar una arrow function: editar = (id: number) => { ... }
  editar(id: number) {
    return this.router.navigate([`/actividades/editar-actividad/${id}`]);
  }
 */
  extraerHora(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[1].substring(0, 5) : '';
  }

  extraerFecha(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[0] : '';
  }
}


