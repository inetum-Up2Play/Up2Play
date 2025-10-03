import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../features/user/models/usuario.model'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/usuarios';

  constructor(private Http: HttpClient) {
  }

  obtenerUsuarios(): Observable<Usuario[]>{
    return this.Http.get<Usuario[]>(this.apiUrl);
  }

  /*
  Esto habrá que sustituirlo por la lógica real 
  del endpoint de login() del backend
  */
  currentUser = {
    username: 'RandomUser',
    hasPermissions: true
  }
}
