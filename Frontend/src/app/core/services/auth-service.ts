import { Injectable, inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoginResponse, Credentials } from './auth-types';

const STORAGE_KEY = 'auth';
const SKEW_MS = 10_000; // margen 10s

// Opcional: tipa explícitamente el resultado
export type LoginResult = true | 'INVALID_CREDENTIALS' | 'EMAIL_NOT_VERIFIED' | 'UNKNOWN';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private readonly http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://localhost:8080/auth';
  private logoutTimer: any;

  register(payload: { email: string; password: string; nombre_usuario: string; }) {
    return this.http.post(`${this.baseUrl}/signup`, payload);
  }

  verification(payload: {email: string; verificationCode: string }) { 
    return this.http.post(`${this.baseUrl}/verify`, payload);
  }

  
  validateToken(token: string) {
    return this.http.get<{ email: string }>(`${this.baseUrl}/validate-token?token=${token}`);
  }


  login(email: string, password: string) {
    // Si ya tienes Credentials importado, úsalo:
    const body: Credentials = { email, password };

    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, body).pipe(
      map((res) => {
        // res: { token: string; expiresIn: number } en **milisegundos**
        this.setSession(res);             // <- guarda {token, expiresAt} y programa auto-logout
        return true as const;             // <- encaja con tu onSubmit(...)
      }),
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 401: return of('INVALID_CREDENTIALS' as const);
          case 403: return of('EMAIL_NOT_VERIFIED' as const);
          default:  return of('UNKNOWN' as const);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.token && !this.isTokenExpired();
  }
  
  /** Limpia storage y redirige a /login si corresponde */
  logout(navigateToLogin = true) {
    if (this.logoutTimer) clearTimeout(this.logoutTimer);
    sessionStorage.removeItem(STORAGE_KEY);
    if (navigateToLogin) {
      this.router.navigate(['/auth/login'], { queryParams: { reason: 'expired' } });
    }
  }

  canActivate(stateUrl: string): boolean | UrlTree {
    if (this.isLoggedIn()) {
      return true;
    }
    return this.router.parseUrl(`/auth/login?redirect=${encodeURIComponent(stateUrl)}`);
  }
  
  /** Calcula expiresAt a partir de expiresIn (ms) y guarda en sessionStorage */
  private setSession(res: LoginResponse) {
    const expiresAt = Date.now() + res.expiresIn;
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: res.token, expiresAt })
    );
    this.scheduleAutoLogout(expiresAt);
  }
  
  /** Relee storage al arrancar la app y reprograma logout */
  initFromStorageOnAppStart() {
    const auth = this.getAuth();
    if (!auth) return;
    if (this.isTokenExpired()) {
      this.logout(false);
      return;
    }
    this.scheduleAutoLogout(auth.expiresAt);
  }
  
  /** Programa el logout cuando venza el token */
  private scheduleAutoLogout(expiresAt: number) {
    if (this.logoutTimer) clearTimeout(this.logoutTimer);

    const msLeft = expiresAt - Date.now() - SKEW_MS;
    if (msLeft <= 0) {
      this.logout(false);
      return;
    }
    this.logoutTimer = setTimeout(() => this.logout(true), msLeft);
  }
 
  /** Helpers de estado */
  getAuth(): { token: string; expiresAt: number } | null {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  get token(): string | null {
    return this.getAuth()?.token ?? null;
  }

  isTokenExpired(): boolean {
    const auth = this.getAuth();
    if (!auth) return true;
    return Date.now() >= (auth.expiresAt - SKEW_MS);
  }
}
