import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { ErrorResponseDto } from '../../../shared/models/ErrorResponseDto';

@Injectable({
  providedIn: 'root',
})
export class NotificacionesService {
  private readonly http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://localhost:8080/actividades';

  //Lista de notificaciones
  getNotificaciones (): Observable<any> {
    return this.http.get(this.baseUrl + '/getNotificacionesUsuario', {}).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
      })
    );
  }

  //Decir que la notifcación está leída
  setLeida() {

  }

  eliminarNotificacion() {
    
  }

}
