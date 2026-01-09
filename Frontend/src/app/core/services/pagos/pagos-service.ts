import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';


export interface PaymentInfo {
  actividadId: number;
  nombre: string;
  precio: number;
  organizadorStripeId: string;
}

@Injectable({
  providedIn: 'root',
})
export class PagosService {
  private readonly http = inject(HttpClient);
  private router = inject(Router);
  
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

}
