import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ActUpdateService {
  
  private updateSubject = new Subject<void>();
  update$ = this.updateSubject.asObservable();

  notifyUpdate() {
    this.updateSubject.next();
  }

  //Guardar deporte actual para carrousel home
   private deporteActual: string | null = null;

  setDeporte(deporte: string | null) {
    this.deporteActual = deporte;
  }

  getDeporte(): string | null {
    return this.deporteActual;
  }
}


