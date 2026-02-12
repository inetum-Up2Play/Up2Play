import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Perfil } from '../../../shared/models/Perfil';
import { ErrorResponseDto } from '../../../shared/models/ErrorResponseDto';

@Injectable({
  providedIn: 'root'
})

export class PerfilService {
  private readonly http = inject(HttpClient);
  private baseUrl = 'http://localhost:8082/perfil';

  // Signal para saber el avatar que usa el usuario
  public avatarGlobal = signal<number>(0);

  //Método obtener datos de perfil
  getPerfil(): Observable<Perfil>{
    return this.http.get<Perfil>(`${this.baseUrl}`+`/obtenerPerfil`).pipe(
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return throwError(() => errBody?.error ?? 'UNKNOWN');
      })
    );
  }
    
  // Enviando un idUsuario, actualiza datos del perfil
  editarPerfil(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/editarPerfil/${id}`, payload).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
        })
    );
  }

  // Enviando un idUsuario, devuelve su perfil
  getPerfilByUserId(id: number): Observable<Perfil>{
    return this.http.get<Perfil>(`${this.baseUrl}`+`/obtenerPerfil/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return throwError(() => errBody?.error ?? 'UNKNOWN');
      })
    );
  }
}
