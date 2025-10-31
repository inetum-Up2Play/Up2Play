import { Injectable, inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoginResponse} from './auth-types';
import { ErrorResponseDto } from '../models/ErrorResponseDto';


const STORAGE_KEY = 'auth';
const SKEW_MS = 10_000; // margen 10s


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

  verification(payload: { email: string; verificationCode: string }) {
    return this.http.post(`${this.baseUrl}/verify`, payload);
  }

  resendVerificationCode(email: string) {
    return this.http.post(`${this.baseUrl}/resend`, email);
  }

  newPasswordCode(payload: { email: string }) {
    return this.http.post(`${this.baseUrl}/verifyEmail`, payload);
  }

  resendNewPasswordCode(payload: { email: string }) {
    return this.http.post(`${this.baseUrl}/resendEmail`, payload);
  }

  validateToken(token: string) {
    return this.http.get<{ email: string }>(`${this.baseUrl}/validate-token?token=${token}`);
  }


  login(payload: { email: string, password: string }) {


    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload).pipe(
      map((res) => {
        this.setSession(res);           // Guarda errore y programa auto-logout
        return true;
      }),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN'); // Devuelve el mensaje tal cual venga del backend
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
