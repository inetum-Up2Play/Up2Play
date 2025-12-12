import { Component, inject, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { ActService } from '../../../../core/services/actividad/act-service';
import { Actividad } from '../../../../shared/models/Actividad';
import { Router, RouterLink } from '@angular/router';
import { map, tap } from 'rxjs';
import { AsyncPipe, DatePipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-proximos-planes',
  imports: [AsyncPipe, RouterLink, SlicePipe, DatePipe],
  templateUrl: './proximos-planes.html',
  styleUrl: './proximos-planes.scss',
})
export class ProximosPlanes {
  private actService = inject(ActService);
  private router = inject(Router);

  // Observable original
  proximosPlanes$ = this.actService.listarActividadesApuntadas();

  // Ordena por fecha más cercana (ascendente) y limita a 5.
  actividadesMin$ = this.proximosPlanes$.pipe(
    map((actividades: Actividad[]) => {
      const toEpoch = (value: unknown): number => {
        if (value == null) return Number.POSITIVE_INFINITY;

        // Si es string, intentamos formato ISO
        const s = String(value).trim();
        if (!s) return Number.POSITIVE_INFINITY;

        // Caso ISO "yyyy-MM-ddTHH:mm:ss(.SSS)"
        const isoDate = new Date(s);
        if (!isNaN(isoDate.getTime())) {
          return isoDate.getTime();
        }

        // Formato desconocido
        return Number.POSITIVE_INFINITY;
      };
      
      const now = Date.now();

      return [...actividades]
        .filter(a => toEpoch(a.fecha as any) >= now)
        .sort((a, b) => toEpoch(a.fecha as any) - toEpoch(b.fecha as any)) // ascendente
        .slice(0, 5)
        .map(a => ({
          id: a.id,
          nombre: a.nombre,
          fecha: a.fecha,   
          ubicacion: a.ubicacion,
        }));
    }),
  );

}

