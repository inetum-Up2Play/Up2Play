import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, of, throwError } from 'rxjs';

import { Actividad } from '../../../shared/models/Actividad';
import { ErrorResponseDto } from '../../../shared/models/ErrorResponseDto';

@Injectable({
  providedIn: 'root',
})
export class ActService {
  private readonly http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://localhost:8082/actividades';

  // Crear actividad
  crearActividad(payload: any): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl + '/crearActividad'}`, payload)
      .pipe(
        map(() => true),
        catchError((error: HttpErrorResponse) => {
          const errBody = error.error as ErrorResponseDto;
          return of(errBody?.error ?? 'UNKNOWN');
        })
      );
  }

  // Editar actividad
  editarActividad(id: number, payload: any): Observable<any> {
    this.comprobarCreador(id);
    return this.http.put(`${this.baseUrl}/editarActividad/${id}`, payload).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const codigo = (error.error as ErrorResponseDto)?.error ?? 'UNKNOWN';
        return throwError(() => codigo);
      })
    );
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const idActividad = Number(route.paramMap.get('id'));
    return this.comprobarCreador(idActividad).pipe(
      map((isCreador) =>
        isCreador ? true : this.router.parseUrl(`/actividades`)
      ),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return throwError(() => errBody?.error ?? 'UNKNOWN');
      })
    );
  }

  // Obtener actividad por id
  getActividad(id: number): Observable<Actividad> {
    return this.http.get<Actividad>(this.baseUrl + `/${id}`, {}).pipe(
      // map((res) => res),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return throwError(() => errBody?.error ?? 'UNKNOWN');
      })
    );
  }

  // Listar todas las actividades
  listarActividades() {
    return this.http.get(this.baseUrl + '/getAll', {}).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
      })
    );
  }

  // Listar actividades creadas por el usuario
  listarActividadesCreadas(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/getCreadas', {}).pipe(
      catchError((error) => {
        console.error('Error al obtener actividades', error);
        return of([]); // Devuelve array vacío si falla
      })
    );
  }

  // Listar actividades a las que el usuario no está apuntado
  listarActividadesNoApuntadas(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/getNoApuntadas').pipe(
      catchError((error) => {
        console.error('Error al obtener actividades', error);
        return of([]); // Devuelve array vacío si falla
      })
    );
  }

  // Listar todas las actividades a las que el usuario está apuntado
  listarActividadesApuntadas(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/getApuntadasCalendario').pipe(
      catchError((error) => {
        console.error('Error al obtener actividades', error);
        return of([]); // Devuelve array vacío si falla
      })
    );
  }

  // Listar todas las actividades de la aplicación que todavía no han sucedido
  listarActividadesApuntadasPendientes(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/getApuntadas').pipe(
      catchError((error) => {
        console.error('Error al obtener actividades', error);
        return of([]); // Devuelve array vacío si falla
      })
    );
  }

  // Eliminar actividad
  deleteActividad(id: number) {
    return this.http.delete(this.baseUrl + `/delete/${id}`, {}).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const codigo = (error.error as ErrorResponseDto)?.error ?? 'UNKNOWN';
        return throwError(() => codigo);
      })
    );
  }

  // Apuntarte a actividad
  unirteActividad(idActividad: number): Observable<any> {
    return this.http
      .put<any>(`${this.baseUrl}/${idActividad}/participantes`, {})
      .pipe(
        // map(() => true),
        catchError((error: HttpErrorResponse) => {
          const codigo = (error.error as ErrorResponseDto)?.error ?? 'UNKNOWN';
          return throwError(() => codigo); // Propaga el código al bloque error
        })
      );
  }

  // Desapuntarte a actividad
  desapuntarseActividad(idActividad: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${idActividad}/participantes`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const codigo = (error.error as ErrorResponseDto)?.error ?? 'UNKNOWN';
          return throwError(() => codigo);
        })
      );
  }

  // Enviado idActividad, comprueba si el usuario es el creador
  comprobarCreador(idActividad: number): Observable<boolean> {
    return this.http
      .get<boolean>(`${this.baseUrl}/isCreador/${idActividad}`)
      .pipe(catchError(() => of(false)));
  }

  // Enviando idActividad, comprueba si el usuario está ya apuntado
  estoyApuntado(idActividad: number): Observable<boolean> {
    return this.http
      .get<boolean>(`${this.baseUrl}/isUsuarioApuntado/${idActividad}`)
      .pipe(
        catchError(() => of(false)) // Si hay error, asumimos que NO está apuntado
      );
  }

  // Recoger todos los usuarios inscritos en una actividad
  usuariosInscritosActividad(idActividad: number) {
    return this.http.get<any[]>(`${this.baseUrl}/${idActividad}/participantes`).pipe(
      catchError((error) => {
        console.error('Error al obtener usuarios', error);
        return of([]); // Devuelve array vacío si falla
      })
    );
  }

  // Método listar actividades por deporte
  listarActividadesPorDeporte(deporte: string): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/getNoApuntadasPorDeporte', {
      params: { deporte: deporte }
    }).pipe(
      catchError((error) => {
        console.error('Error al obtener actividades', error);
        return of([]); // Devuelve array vacío si falla
      })
    );
  }

  //Lista las actividades en las que está el usuario y están pasadas
  listarActividadesPasadas(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/getPasadasPorUsuario').pipe(
      catchError((error) => {
        console.error('Error al obtener actividades', error);
        return of([]); // Devuelve array vacío si falla
      })
    );
  }


}
