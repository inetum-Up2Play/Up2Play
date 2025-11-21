import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actividad } from '../../models/Actividad';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { ErrorResponseDto } from '../../models/ErrorResponseDto';
import { AuthService } from '../auth/auth-service';

@Injectable({
  providedIn: 'root',
})
export class ActService {
  private readonly http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://localhost:8080/actividades';
  private logoutTimer: any;


  //Metodo crear actividad
  crearActividad(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl + '/crearActividad'}`, payload).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
      })
    );
  }

  //Metodo editar actividad 
  editarActividad(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/editarActividad/${id}`, payload).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
      })
    );
  }

  //Metodo obtener actividad por id
  getActividad(id: number): Observable<Actividad> {
    return this.http.get<Actividad>(this.baseUrl + `/${id}`, {}).pipe(
      // map((res) => res),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return throwError(() => errBody?.error ?? 'UNKNOWN');
      })
    );
  }

  //Metodo listar todas las actividades
  listarActividades() {
    return this.http.get(this.baseUrl + '/getAll', {}).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
      })
    );
  }

  //Metodo listar actividades creadas por el usuario
  listarActividadesCreadas() {
    return this.http.get(this.baseUrl + '/getCreadas', {}).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
      })
    );
  }

  //Metodo listar actividades a las que el usuario no está apuntado
  listarActividadesNoApuntadas(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/getNoApuntadas').pipe(
      catchError(error => {
        console.error('Error al obtener actividades', error);
        return of([]); // Devuelve array vacío si falla
      })
    );
  }

  //Metodo eliminar actividad
  deleteActividad(id: number) {
    return this.http.delete(this.baseUrl + `/delete/${id}`, {}).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
      })
    );
  }

  getApuntadas() { }

  //Metodo apuntarte a actividad
  unirteActividad(idActividad: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${idActividad}/participantes`, {}).pipe(
      // map(() => true),
      catchError((error: HttpErrorResponse) => {
        const codigo = (error.error as ErrorResponseDto)?.error ?? 'UNKNOWN';
        return throwError(() => codigo); // Propaga el código al bloque error
      })
    );
  }

  //Metodo desapuntarte a actividad
  desapuntarseActividad(idActividad: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idActividad}/participantes`).pipe(
      catchError((error: HttpErrorResponse) => {
        const codigo = (error.error as ErrorResponseDto)?.error ?? 'UNKNOWN';
        return throwError(() => codigo);
      })
    );
  }


  // Método que devuelve la info de la actividad por ID (mock)
  //infoActividad(id: number): Observable<Actividad> {
  // const actividadMock: Actividad = {
  //   id: 1,
  //   titulo: 'Prueba',
  //   descripcion:
  //     'Este fin de semana vamos a correr por la Playa Larga. Es un plan sencillo para disfrutar del mar y el amanecer mientras hacemos algo de ejercicio. El recorrido será cómodo, apto para cualquiera que quiera moverse y pasar un buen rato. Solo necesitas ropa deportiva y agua. Al terminar, nos quedamos un rato para estirar y charlar. ¿Te animas? :)',
  //   fecha: '2025-11-20',
  //   hora: '08:00',
  //   ubicacion: 'Playa de Tokyo',
  //   nivel: 'Intermedio',
  //   num_pers_inscritas: '3',
  //   num_pers_totales: '10',
  //   estado: 'Pendiente',
  //   precio: '0',
  //   id_usuario_creador: '13',
  //   deporte: 'Running',
  //   //imagen: 'https://media.gq.com.mx/photos/660304abed6388a71e23c80d/16:9/w_2560%2Cc_limit/GettyImages-629586734.jpg'
  // };

  //return of(actividadMock); // Devuelve un Observable simulando la respuesta HTTP


  ComprovarCreador() { }

  estoyApuntado(idActividad: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/isUsuarioApuntado/${idActividad}`).pipe(
      catchError(() => of(false)) // Si hay error, asumimos que NO está apuntado
    );
  }

}
