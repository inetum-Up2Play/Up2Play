import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Perfil {
  private readonly http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://localhost:8080/perfil';
  private logoutTimer: any;
}

//Método obtener datos de usuario
//getUsuario(): Observable<Usuario>{

//}
//Método actualizar datos del ususario
//Método obtener datos de perfil
//Método actualizar datos del perfil
//Método eliminar perfil y usuario
//Método cambiar contraseña

