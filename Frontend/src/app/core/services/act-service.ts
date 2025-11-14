import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ActService {

  private readonly http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://localhost:8080/actividades';
  private logoutTimer: any;

  crearActividad(){}

  editarActividad(){

    return this.http.put(this.baseUrl + '/editarActividad', {})

  }

  eliminarActividad() {

    return this.http.delete(this.baseUrl + '/eliminarActividad', {})

  }

  listarActividades() {
    return this.http.get(this.baseUrl + '/getAll', {})
  }

  listarActividadedsCreadas(){

    return this.http.get(this.baseUrl + '/getActividades', {})

  }

  listarActividadesInscritas(){}

  unirteActividad(){}

  desapuntarteActividad(){}

  infoActividad(){}

  ComprovarCreador(){}

  estoyApuntado(){}
  
}
