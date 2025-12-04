import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Usuario } from '../../../shared/models/usuario.model';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { ErrorResponseDto } from '../../../shared/models/ErrorResponseDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://localhost:8080/usuarios';
  private logoutTimer: any;

  //Método obtener datos de usuario
  getUsuario(): Observable<Usuario>{
  return this.http.get<Usuario>(`${this.baseUrl}`+'/me').pipe(
        
        catchError((error: HttpErrorResponse) => {
          const errBody = error.error as ErrorResponseDto;
          return throwError(() => errBody?.error ?? 'UNKNOWN');
        })
      );
  }
    
//Método actualizar datos del ususario (cambiar contraseña)
  cambiarContraseñaPerfil(id: number, payload: any): Observable<any> {
     return this.http.put(`${this.baseUrl}/cambiar-password/${id}`, payload).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
      })
    );
  }
}
