import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { ActService } from '../../../../core/services/actividad/act-service';
import { Actividad } from '../../../../shared/models/Actividad';

@Component({
  selector: 'app-proximos-planes',
  imports: [AsyncPipe, RouterLink, DatePipe],
  templateUrl: './proximos-planes.html',
  styleUrl: './proximos-planes.scss',
})
export class ProximosPlanes {
  private actService = inject(ActService);

  proximosPlanes$ = this.actService.listarActividadesApuntadas();

  // Ordena por fecha más cercana (ascendente) y limita a 5.
  actividadesMin$ = this.proximosPlanes$.pipe(
    map((actividades: Actividad[]) => {
      const toEpoch = (value: unknown): number => {
        if (value == null) return Number.POSITIVE_INFINITY;

        const s = String(value).trim();
        if (!s) return Number.POSITIVE_INFINITY;

        // "yyyy-MM-ddTHH:mm:ss(.SSS)"
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

