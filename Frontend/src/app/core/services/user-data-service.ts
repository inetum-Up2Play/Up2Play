import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })

export class UserDataService {

  private email: string | null = null;
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return (this.token ?? '').trim();
  }

  clearToken() {
    this.token = null;
  }

  setEmail(email: string) {

    this.email = email;

  }

  
  getEmail(): string {
    return (this.email ?? '').trim();
  }

  clearEmail() {

    this.email = null;

  }

}
