import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';
 
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token;
 
  const shouldAttach = !!token && !auth.isTokenExpired();
 
  const isPublicAuthEndpoint = /(^|\/)auth(\/|$)/.test(req.url);
 
  const authReq = shouldAttach && !isPublicAuthEndpoint
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
 
  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 403) {
        auth.logout();
      }
      return throwError(() => err);
    })
  );
 
};