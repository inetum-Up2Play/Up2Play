import { Component, inject, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { ActService } from '../../../../core/services/actividad/act-service';
import { Actividad } from '../../../../shared/models/Actividad';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-proximos-planes',
  imports: [AsyncPipe],
  templateUrl: './proximos-planes.html',
  styleUrl: './proximos-planes.scss',
})
export class ProximosPlanes implements OnInit {
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
    tap(min => {
      console.log('Solo nombre, fecha, ubicacion:', min);
      console.table(min);
    })
  );

  ngOnInit(): void {
    this.proximosPlanes$.subscribe((actividades: Actividad[]) => {
      console.log('Actividades apuntadas (array):', actividades);
      console.table(actividades);
    });
  }
}

// ---- helpers (puedes moverlos a un archivo util.ts si prefieres)
function normalizeToDay(fecha: string): string {
  return fecha.includes('T') ? fecha.split('T')[0] : fecha;
}

