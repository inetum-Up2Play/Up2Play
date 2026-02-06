import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// IMPORTS DE PRIMENG 
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { MultiSelect } from 'primeng/multiselect';

import { Header } from '../../../../core/layout/header/header';
import { Footer } from '../../../../core/layout/footer/footer';
import { ActService } from '../../../../core/services/actividad/act-service';
import { EmptyActivities } from '../../../actividades/components/empty-activities/empty-activities';
import { DeporteImgPipe } from '../../../actividades/pipes/deporte-img-pipe';
import { ActivityCard } from '../../../actividades/components/activity-card/activity-card';

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

      const matchDeporte = this.filterDeporte && this.filterDeporte.length > 0
        ? this.filterDeporte.includes(act.deporte)
        : true;

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

  removeDeporte(deporteToRemove: string) {
    this.filterDeporte = this.filterDeporte.filter(d => d !== deporteToRemove);
    this.applyFilters();
  }

  extraerHora(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[1].substring(0, 5) : '';
  }

  extraerFecha(fecha: string): string {
    if (!fecha) return '';
    return fecha.includes('T') ? fecha.split('T')[0] : '';
  }

  // Opciones para el dropdown (puedes llenarlo dinámicamente o estático)
  deportesOptions = [
    { label: 'Atletismo', value: 'Atletismo' },
    { label: 'Balonmano', value: 'Balonmano' },
    { label: 'Basquet', value: 'Basquet' },
    { label: 'Béisbol', value: 'Béisbol' },
    { label: 'Billar', value: 'Billar' },
    { label: 'Boxeo', value: 'Boxeo' },
    { label: 'Críquet', value: 'Críquet' },
    { label: 'Ciclismo', value: 'Ciclismo' },
    { label: 'Escalada', value: 'Escalada' },
    { label: 'Esgrima', value: 'Esgrima' },
    { label: 'Esquí', value: 'Esquí' },
    { label: 'Futbol', value: 'Futbol' },
    { label: 'Gimnasia', value: 'Gimnasia' },
    { label: 'Golf', value: 'Golf' },
    { label: 'Hockey', value: 'Hockey' },
    { label: 'Artes Marciales', value: 'Artes Marciales' },
    { label: 'Natación', value: 'Natación' },
    { label: 'Patinaje', value: 'Patinaje' },
    { label: 'Ping Pong', value: 'Ping Pong' },
    { label: 'Piragüismo', value: 'Piragüismo' },
    { label: 'Rugby', value: 'Rugby' },
    { label: 'Remo', value: 'Remo' },
    { label: 'Snowboard', value: 'Snowboard' },
    { label: 'Surf', value: 'Surf' },
    { label: 'Tenis', value: 'Tenis' },
    { label: 'Triatlón', value: 'Triatlón' },
    { label: 'Voleibol', value: 'Voleibol' },
    { label: 'Waterpolo', value: 'Waterpolo' },
    { label: 'Ajedrez', value: 'Ajedrez' },
    { label: 'Badminton', value: 'Badminton' },
    { label: 'Crossfit', value: 'Crossfit' },
    { label: 'Danza Deportiva', value: 'Danza Deportiva' },
    { label: 'Entrenamiento de fuerza', value: 'Entrenamiento de fuerza' },
    { label: 'Equitación', value: 'Equitación' },
    { label: 'Fútbol Americano', value: 'Fútbol Americano' },
    { label: 'Lucha Libre', value: 'Lucha Libre' },
    { label: 'Motocross', value: 'Motocross' },
    { label: 'Padel', value: 'Padel' },
    { label: 'Parkour', value: 'Parkour' },
    { label: 'Skateboarding', value: 'Skateboarding' },
    { label: 'Squash', value: 'Squash' },
    { label: 'Tiro con Arco', value: 'Tiro con Arco' },
    { label: 'Frisbee', value: 'Frisbee' },
    { label: 'Senderismo', value: 'Senderismo' },
    { label: 'Running', value: 'Running' },
    { label: 'Petanca', value: 'Petanca' },
  ];
}
