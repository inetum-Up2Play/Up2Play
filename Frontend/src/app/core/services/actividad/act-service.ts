import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actividad } from '../../models/Actividad';
import { catchError, map, Observable, of } from 'rxjs';
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

  crearActividad(payload: any): Observable<any> {
    // POST al endpoint del backend
    return this.http.post<any>(`${this.baseUrl + '/crearActividad'}`, payload);
  }

  editarActividad(id: number, payload: {}) {
    return this.http.put(this.baseUrl + `/editarActividad/${id}`, payload).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
      })
    );
  }

  getActividad(id: number) {

    return this.http.get(this.baseUrl + `/getPorId/${id}`, {}).pipe(
       map(() => true),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
      })
    );
  }

  listarActividades() {
    return this.http.get(this.baseUrl + '/getAll', {}).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
      })
    );
  }

  listarActividadedsCreadas() {
    return this.http.get(this.baseUrl + '/getCreadas', {}).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
      })
    );
  }
  
    deleteActividad(id: number) {
    return this.http.delete(this.baseUrl + `/delete/${id}`, {}).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
      })
    );
  }

  getApuntadas() {}

  unirteActividad() {}

  desapuntarteActividad() {}

  // Método que devuelve la info de la actividad por ID (mock)
  infoActividad(id: number): Observable<Actividad> {
    const actividadMock: Actividad = {
      id: 1,
      titulo: 'Running por la playa',
      descripcion:
        'Este fin de semana vamos a correr por la Playa Larga. Es un plan sencillo para disfrutar del mar y el amanecer mientras hacemos algo de ejercicio. El recorrido será cómodo, apto para cualquiera que quiera moverse y pasar un buen rato. Solo necesitas ropa deportiva y agua. Al terminar, nos quedamos un rato para estirar y charlar. ¿Te animas? :)',
      fecha: '2025-11-20',
      hora: '08:00',
      ubicacion: 'Playa de Tokyo',
      nivel: 'Intermedio',
      num_pers_inscritas: '3',
      num_pers_totales: '10',
      estado: 'Pendiente',
      precio: '0',
      id_usuario_creador: '13',
      deporte: 'Running',
      //imagen: 'https://media.gq.com.mx/photos/660304abed6388a71e23c80d/16:9/w_2560%2Cc_limit/GettyImages-629586734.jpg'
    };

    return of(actividadMock); // Devuelve un Observable simulando la respuesta HTTP
  }

  ComprovarCreador() {}

  estoyApuntado() {}
}
