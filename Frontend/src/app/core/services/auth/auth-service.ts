import { Injectable, inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoginResponse } from './auth-types';
import { ErrorResponseDto } from '../../../shared/models/ErrorResponseDto';
import { UserDataService } from './user-data-service';

const STORAGE_KEY = 'auth';
const SKEW_MS = 10_000;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private router = inject(Router);
  private userDataService = inject(UserDataService);
  private baseUrl = 'http://localhost:8082/auth';
  private logoutTimer: any;

  // REGISTRO
  register(payload: {
    email: string;
    password: string;
    nombre_usuario: string;
  }) {
    return this.http.post(`${this.baseUrl}/signup`, payload).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
      })
    );
  }

  // VERIFICACIÓN DE CUENTA
  verification(payload: { email: string; verificationCode: string }) {
    return this.http.post(`${this.baseUrl}/verify`, payload).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
      })
    );
  }

  // REENVÍO DE CÓDIGO DE VERIFICACIÓN
  resendVerificationCode(payload: { email: string }) {
    return this.http.post(`${this.baseUrl}/resend`, payload).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
      })
    );
  }

  // SOLICITAR CÓDIGO PARA CAMBIAR CONTRASEÑA
  newPasswordCode(payload: { email: string }) {
    return this.http.post(`${this.baseUrl}/verifyEmail`, payload).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
      })
    );
  }

  // VERIFICAR CÓDIGO NUEVA CONTRASEÑA
  verifyNewPasswordCode(payload: { email: string; verificationCode: string }) {
    return this.http.post(`${this.baseUrl}/verifyForgetPassword`, payload).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
      })
    );
  }

  // REENVIAR CÓDIGO PARA CAMBIAR CONTRASEÑA
  resendNewPasswordCode(payload: { email: string }) {
    return this.http.post(`${this.baseUrl}/resendEmail`, payload).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
      })
    );
  }

  // VALIDAR TOKEN
  validateToken(token: string) {
    return this.http
      .get<{ email: string }>(`${this.baseUrl}/validate-token?token=${token}`)
      .pipe(
        map((res) => res), // ← aquí sí se devuelve el objeto con email
        catchError((error: HttpErrorResponse) => {
          const errBody = error.error as ErrorResponseDto;
          return of(errBody?.error ?? 'UNKNOWN');
        })
      );
  }

  // NUEVA CONTRASEÑA
  saveNewPassword(payload: { email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/saveNewPassword`, payload).pipe(
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
      })
    );
  }

  // LOGIN
  login(payload: { email: string; password: string }) {
    this.userDataService.setEmail(payload.email);
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload).pipe(
      map((res) => {
        this.setSession(res);
        return true;
      }),
      catchError((error: HttpErrorResponse) => {
        const errBody = error.error as ErrorResponseDto;
        return of(errBody?.error ?? 'UNKNOWN');
      })
    );
  }

  // ESTADO DE SESIÓN
  isLoggedIn(): boolean {
    return !!this.token && !this.isTokenExpired();
  }

  logout(navigateToLogin = true) {
    if (this.logoutTimer) clearTimeout(this.logoutTimer);
    sessionStorage.removeItem(STORAGE_KEY);
    this.userDataService.clearEmail();
    if (navigateToLogin) {
      this.router.navigate(['/auth/login'], {
        queryParams: { reason: 'expired' },
      });
    }
  }

  canActivate(stateUrl: string): boolean | UrlTree {
    if (this.isLoggedIn()) {
      return true;
    }
    return this.router.parseUrl(
      `/auth/login?redirect=${encodeURIComponent(stateUrl)}`
    );
  }

  private setSession(res: LoginResponse) {
    const expiresAt = Date.now() + res.expiresIn;
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: res.token, expiresAt })
    );
    this.scheduleAutoLogout(expiresAt);
  }

  initFromStorageOnAppStart() {
    const auth = this.getAuth();
    if (!auth) return;
    if (this.isTokenExpired()) {
      this.logout(false);
      return;
    }
    this.scheduleAutoLogout(auth.expiresAt);
  }

  private scheduleAutoLogout(expiresAt: number) {
    if (this.logoutTimer) clearTimeout(this.logoutTimer);

    const msLeft = expiresAt - Date.now() - SKEW_MS;
    if (msLeft <= 0) {
      this.logout(false);
      return;
    }
    this.logoutTimer = setTimeout(() => this.logout(true), msLeft);
  }

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
    return Date.now() >= auth.expiresAt - SKEW_MS;
  }
}
