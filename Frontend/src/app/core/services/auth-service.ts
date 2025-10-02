import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { UserService } from './user-service';

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
}

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return authService.canActivate();
};