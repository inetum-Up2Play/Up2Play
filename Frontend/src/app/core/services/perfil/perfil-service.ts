import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Usuario } from '../../../shared/models/usuario.model';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { ErrorResponseDto } from '../../../shared/models/ErrorResponseDto';

@Injectable({
  providedIn: 'root'
})
export class Perfil {
  private readonly http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://localhost:8080/perfil';
  private logoutTimer: any;
}


//Método obtener datos de perfil
//Método actualizar datos del perfil
//Método eliminar perfil y usuario
//Método cambiar contraseña

