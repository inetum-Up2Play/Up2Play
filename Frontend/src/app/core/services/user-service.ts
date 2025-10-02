import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  

  /*
  Esto habrá que sustituirlo por la lógica real 
  del endpoint de login() del backend
  */
  currentUser = {
    username: 'RandomUser',
    hasPermissions: true
  }
}
