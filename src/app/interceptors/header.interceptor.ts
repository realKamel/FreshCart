import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  const _PLATFORM_ID = inject(PLATFORM_ID);
  if (isPlatformBrowser(_PLATFORM_ID)) {
    const _AuthService = inject(AuthService);
    req = req.clone({
      headers: req.headers.set('token', _AuthService.getUserToken() ?? ''),
    });
  }
  return next(req);
};
