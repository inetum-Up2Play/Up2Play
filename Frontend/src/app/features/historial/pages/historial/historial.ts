// Angular
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';

// App (layout, servicios, utils, componentes/pipes)
import { Footer } from '../../../../core/layout/footer/footer';
import { Header } from '../../../../core/layout/header/header';
import { ActService } from '../../../../core/services/actividad/act-service';
import { DEPORTES } from '../../../../core/utils/deportes.constant';
import { ActivityCard } from '../../../actividades/components/activity-card/activity-card';
import { EmptyActivities } from '../../../actividades/components/empty-activities/empty-activities';
import { DeporteImgPipe } from '../../../actividades/pipes/deporte-img-pipe';


@Component({
  selector: 'app-historial',
  imports: [
    Header,
    Footer,
    CommonModule,
    EmptyActivities,
    DeporteImgPipe,
    MultiSelect,
    FormsModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    DatePickerModule,
    ActivityCard
  ],
  templateUrl: './historial.html',
  styleUrl: './historial.scss',
})

export class Historial implements OnInit {
  private actService = inject(ActService);

  activities: any[] = [];
  visibleActivities: any[] = [];
  noHayActividades = true;

  numeroActividades: number = 6;

  // Variables para filtros
  filterNombre: string = '';
  filterDeporte: string[] = [];
  filterFecha: Date | null = null;

  ngOnInit(): void {
    this.cargarActividades();
  }

  removeDeporte(deporteToRemove: string) {
    this.filterDeporte = this.filterDeporte.filter(d => d !== deporteToRemove);
    this.applyFilters();
  }

  cargarActividades() {
    this.actService.listarActividadesPasadas().subscribe({
      next: (data: any) => {
        this.activities = data;
        this.noHayActividades = this.activities.length === 0;
        this.visibleActivities = data;
      },
      error: (err) => {
        console.error('Error cargando actividades', err);
        this.activities = [];
        this.noHayActividades = true;
        this.visibleActivities = [];
      },
    });
  }

  loadMore(): void {
    this.numeroActividades += 3;
  }

  // Lógica de Filtrado
  applyFilters() {
    this.visibleActivities = this.activities.filter((act) => {
      const matchNombre = this.filterNombre
        ? act.nombre.toLowerCase().includes(this.filterNombre.toLowerCase())
        : true;

      // Si el array tiene elementos, miramos si el deporte de la actividad está DENTRO (.includes)
      // Si el array está vacío (0), devolvemos true (mostrar todos)
      const matchDeporte = this.filterDeporte && this.filterDeporte.length > 0
        ? this.filterDeporte.includes(act.deporte)
        : true;

      // Filtro Fecha
      let matchFecha = true;
      if (this.filterFecha) {
        const actDate = new Date(act.fecha);
        matchFecha =
          actDate.getDate() === this.filterFecha.getDate() &&
          actDate.getMonth() === this.filterFecha.getMonth() &&
          actDate.getFullYear() === this.filterFecha.getFullYear();
      }

      return matchNombre && matchDeporte && matchFecha;
    });
  }

  clearFilters() {
    this.filterNombre = '';
    this.filterDeporte = [];
    this.filterFecha = null;
    this.visibleActivities = [...this.activities]; // Restaurar lista completa
  }

  extraerHora(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[1].substring(0, 5) : '';
  }

  extraerFecha(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[0] : '';
  }

  // Json deportes
  deportesOptions = DEPORTES;
}
