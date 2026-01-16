import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { ErrorResponseDto } from '../../../shared/models/ErrorResponseDto';
import {
  Notificacion

} from '../../../shared/models/Notificacion';
@Injectable({
  providedIn: 'root',
})
export class NotificacionesService {
  private readonly http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://localhost:8082/notificaciones';

  //Lista de notificaciones
  getNotificacionesUsuario(): Observable<Notificacion[]> {
    return this.http
      .get<Notificacion[]>(`${this.baseUrl}/getNotificacionesUsuario`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const errBody = error.error as ErrorResponseDto;
          return throwError(() => new Error(errBody?.error ?? 'UNKNOWN'));
        })
      );
  }


  //Decir que la notifcación está leída
  marcarComoLeida(id: number): Observable<{ message: string }> {
    return this.http
      .put<{ message: string }>(`${this.baseUrl}/leerNotificacion/${id}`, {})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const errBody = error.error as ErrorResponseDto;
          return throwError(() => new Error(errBody?.error ?? 'UNKNOWN'));
        })
      );
  }


  eliminarNotificacion(id: number): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${this.baseUrl}/eliminarNotificacion/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const errBody = error.error as ErrorResponseDto;
          return throwError(() => new Error(errBody?.error ?? 'UNKNOWN'));
        })
      );
  }


}
