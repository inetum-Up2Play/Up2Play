import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Perfil } from '../../../shared/models/Perfil';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { ErrorResponseDto } from '../../../shared/models/ErrorResponseDto';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private readonly http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://localhost:8081/perfil';
  private logoutTimer: any;

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
    
  //Método actualizar datos del perfil
  editarPerfil(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/editarPerfil/${id}`, payload).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
        })
    );
  }

  getPerfilByUserId(id: number): Observable<Perfil>{
    return this.http.get<Perfil>(`${this.baseUrl}`+`/obtenerPerfil/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return throwError(() => errBody?.error ?? 'UNKNOWN');
      })
    );
  }





}
