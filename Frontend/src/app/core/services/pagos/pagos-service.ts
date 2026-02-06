import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

// INTERFACES
export interface PaymentInfo {
  actividadId: number;
  nombre: string;
  precio: number;
  organizadorStripeId: string;
  deporte?: string;
  fecha?: string;
  ubicacion?: string;
}

export interface PagoDtoResp {
  id: number;
  fecha: string;            // ISO: '2026-10-14T18:30:00Z' (o similar)
  total: number;
  usuario: number;
  actividadId: number;
  nombreActividad: string;
  estado: 'Completado' | 'Fallido' | 'Reembolsado' | string;
}

export interface ActividadCreadaDto {
  id: number;
  nombre: string;
  descripcion?: string;
  fecha?: string;            // "2026-01-14T08:22:37.624752" (LocalDateTime → string)
  ubicacion?: string;
  deporte?: string;
  nivel?: string;
  numPersInscritas: number;
  numPersTotales: number;
  estado?: string;
  precio: number;
  usuarioCreador?: number;
  emailCreador?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PagosService {
  private readonly http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://localhost:8082/pagos';

  // Guardamos la actividad seleccionada en una Signal
  private _selectedActivity = signal<PaymentInfo | null>(null);

  // Selector público para leer el valor
  selectedActivity = this._selectedActivity.asReadonly();

  setActivity(activity: PaymentInfo) {
    this._selectedActivity.set(activity);
  }

  //Guarda la actividad en el almacenamiento temporal del navegador para que sobreviva a la redirección de Stripe.
  guardarTransaccionPendiente(activity: any) {
    sessionStorage.setItem('pending_payment', JSON.stringify(activity));
  }

  recuperarTransaccionPendiente(): any | null {
    const data = sessionStorage.getItem('pending_payment');
    return data ? JSON.parse(data) : null;
  }

  clear() {
    this._selectedActivity.set(null);
    sessionStorage.removeItem('pending_payment');
  }

  // Lista los pagos del usuario
  getPagosUsuarioActual(): Observable<PagoDtoResp[]> {
    return this.http.get<PagoDtoResp[]>(
      `${this.baseUrl}/getPagos`,
    );
  }

}
