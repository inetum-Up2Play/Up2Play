import { Component, computed, EventEmitter, inject, Input, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

// --- Servicios Propios ---
import { ActService } from '../../../../core/services/actividad/act-service';

// --- PrimeNG Imports ---
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-activity-card',
  imports: [CardModule, ButtonModule, MessageModule, TagModule, CurrencyPipe, DatePipe],
  providers: [],
  templateUrl: './activity-card.html',
  styleUrl: './activity-card.scss',
})

export class ActivityCard implements OnInit{
  // --- Inyecciones ---
  private actService = inject(ActService);
  private router = inject(Router);

  // --- Inputs (Signals) ---
  titulo = input.required<string>();
  fecha = input.required<string>();
  hora = input.required<string>();
  ubicacion = input.required<string>();
  precio = input<number>(0);
  imagen = input<string>('');
  isCreador = signal<boolean>(false);

  ngOnInit(): void {
    this.actService
      .comprobarCreador(this.actividadId)
      .subscribe((flag) => this.isCreador.set(flag));
  }

  // --- Inputs (Decoradores - Manteniendo consistencia con tu código) ---
  @Input() botonLabel!: string;
  @Input() botonStyle!: string;

  // Callback opcional
  @Input() actividadId!: number;

  redirigirInfoActividad() {
    return this.router.navigate([
      `/actividades/info-actividad/${this.actividadId}`,
    ]);
  }

  // Boolean para saber si la actividad ha pasado
  isCompletada = computed(() => {
    const f = this.fecha();
    const h = this.hora();
    
    if (!f || !h) return false;

    // Construimos la fecha completa para comparar con la actual
    const fechaActividad = new Date(`${f}T${h}:00`);
    const ahora = new Date();

    return fechaActividad < ahora;
  });
}