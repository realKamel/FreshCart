import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { toast } from 'ngx-sonner';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const _PLATFORM_ID = inject(PLATFORM_ID);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (isPlatformBrowser(_PLATFORM_ID)) {
        toast.error(err.error.message || 'An unexpected error occurred.');
      } else {
        console.error(err.error.message);
      }
      return throwError(() => err);
    }),
  );
};
