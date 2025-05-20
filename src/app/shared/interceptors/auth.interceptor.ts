import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../../services/toast/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const token = sessionStorage.getItem('tkn_ai_prt');

  const authReq = token && !req.url.includes('auth/login')
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        toastService.clear();
        setTimeout(() => {
          toastService.show('Token expirado. Redirecionando para o login', 'error', 5000);
        }, 10);
      }

      return throwError(() => error);
    })
  );
};