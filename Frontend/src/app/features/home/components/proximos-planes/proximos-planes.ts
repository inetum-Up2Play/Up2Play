import { Component, inject, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { ActService } from '../../../../core/services/actividad/act-service';
import { Actividad } from '../../../../shared/models/Actividad';
import { Router, RouterLink } from '@angular/router';
import { map, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-proximos-planes',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './proximos-planes.html',
  styleUrl: './proximos-planes.scss',
})
export class ProximosPlanes {
  private actService = inject(ActService);
  private router = inject(Router);

  // Observable original
  proximosPlanes$ = this.actService.listarActividadesApuntadas();

  // Nuevo observable con solo nombre, fecha (normalizada) y ubicacion
  actividadesMin$ = this.proximosPlanes$.pipe(
    map((actividades: Actividad[]) =>
      actividades.map(a => ({
        id: a.id,
        nombre: a.nombre,
        fecha: normalizeToDay(a.fecha),
        ubicacion: a.ubicacion,
      }))
    ),
  );
}

// ---- helpers (puedes moverlos a un archivo util.ts si prefieres)
function normalizeToDay(fecha: string): string {
  return fecha.includes('T') ? fecha.split('T')[0] : fecha;
}

