import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../../shared/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private Http: HttpClient) {
  }

  // getUser(id: number): Observable<Usuario> {
  //   //API backend
  // }
}
