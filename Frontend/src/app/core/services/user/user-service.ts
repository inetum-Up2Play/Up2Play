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
import { CambiarPasswordDto } from '../../../features/profile/components/form-profile/form-profile';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://localhost:8081/usuarios';
  private logoutTimer: any;

  //Método obtener datos de usuario
  getUsuario(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}` + '/me').pipe(

      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return throwError(() => errBody?.error ?? 'UNKNOWN');
      })
    );
  }

  getUsuarioPorId(id: number): Observable<Usuario> {
    // Asegúrate de que tu Backend (UsuarioController) tenga un endpoint GET /usuarios/{id}
    // y que devuelva el objeto Usuario CON el stripeAccountId
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
}

  //Método actualizar datos del ususario (cambiar contraseña)
  cambiarContraseñaPerfil(payload: CambiarPasswordDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/cambiar-password`, payload).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
      })
    );
  }

//Eliminar usuario   
  eliminarUsuario() {
      return this.http.delete(this.baseUrl + `/eliminarUsuario`).pipe(
        map(() => true),
        catchError((error: HttpErrorResponse) => {
          const errBody = error.error as ErrorResponseDto;
          return of(errBody?.error ?? 'UNKNOWN');
        })
      );
    
  }


}
