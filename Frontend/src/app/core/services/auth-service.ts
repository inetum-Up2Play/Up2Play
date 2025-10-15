import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { UserService } from './user-service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  private router = inject(Router);
  private userService = inject(UserService);
  private baseUrl = 'http://localhost:8080/auth';
  private readonly tokenKey = 'accessToken';

  canActivate(): boolean {
    if (!this.userService.currentUser.hasPermissions) {
      this.router.navigate(['/auth/login']);
    }
    return this.userService.currentUser.hasPermissions;
  }
 
  register(payload: { email: string; password: string; nombre_usuario: string; }) {
    return this.http.post(`${this.baseUrl}/signup`, payload);
  }

  login(email: string, password: string) {
    return this.http.post<{ accessToken: string }>(`${this.baseUrl}/login`, { email, password }).pipe(
      map(response => {
        // ✅ Login correcto: guardar token y devolver éxito
        const token = response.accessToken;
        sessionStorage.setItem(this.tokenKey, token);
        return true;
      }),
      catchError(error => {
        switch (error.status) {
          case 401:
            return of('INVALID_CREDENTIALS'); // Credenciales incorrectas
          case 403:
            return of('EMAIL_NOT_VERIFIED');   // Falta verificación
          default:
            return of('UNKNOWN');              // Otro error
        }
      })
    );
  }
  
  get token(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  logout() {
    sessionStorage.removeItem(this.tokenKey);
  }
}

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return authService.canActivate();
};