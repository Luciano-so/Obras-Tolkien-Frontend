import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from '../../shared/toast/toast.service';
import { MatDialog } from '@angular/material/dialog';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastSrv = inject(ToastService);
  const dialog = inject(MatDialog);

  const token = sessionStorage.getItem('token');

  const authReq = token
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    : req;

  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401) {
        dialog.closeAll();
        toastSrv.onShowError('Sua sessão expirou. Faça login novamente.');
        sessionStorage.removeItem('token');
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};
