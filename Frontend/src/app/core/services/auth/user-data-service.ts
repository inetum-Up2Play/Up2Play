import { Injectable, signal, WritableSignal } from '@angular/core';

const EMAIL_STORAGE_KEY = 'user_email';
const TOKEN_STORAGE_KEY = 'user_token';

@Injectable({ providedIn: 'root' })

export class UserDataService {
  // Signals que se inicializan desde sessionStorage para persistencia
  private emailSignal: WritableSignal<string> = signal(this.loadEmail());
  private tokenSignal: WritableSignal<string> = signal(this.loadToken());

  private loadEmail(): string {
    return sessionStorage.getItem(EMAIL_STORAGE_KEY) || '';
  }

  private loadToken(): string {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY) || '';
  }

  setToken(token: string) {
    this.tokenSignal.set(token);
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  getToken(): string {
    return (this.tokenSignal() ?? '').trim();
  }

  clearToken() {
    this.tokenSignal.set('');
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  setEmail(email: string) {
    this.emailSignal.set(email);
    sessionStorage.setItem(EMAIL_STORAGE_KEY, email);
  }

  // DEVUELVE EL EMAIL DEL USER LOGGEADO
  getEmail(): string {
    return (this.emailSignal() ?? '').trim();
  }

  getEmailSignal(): WritableSignal<string> {
    return this.emailSignal;
  }

  clearEmail() {
    this.emailSignal.set('');
    sessionStorage.removeItem(EMAIL_STORAGE_KEY);
  }
}

