import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { UserService } from './user-service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(): boolean {
    if (!this.userService.currentUser.hasPermissions) {
      this.router.navigate(['/auth/login']);
    }
    return this.userService.currentUser.hasPermissions;
  }


  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/auth';

  register(payload: { email: string; password: string; nombre_usuario: string; }) {
    return this.http.post(`${this.baseUrl}/signup`, payload);
  }
}

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return authService.canActivate();
};