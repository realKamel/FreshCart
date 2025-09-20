import { inject, PLATFORM_ID } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { SpinnerService } from '../services/spinner.service';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const _PLATFORM_ID = inject(PLATFORM_ID);
  const _SpinnerService = inject(SpinnerService);
  if (isPlatformBrowser(_PLATFORM_ID)) {
    _SpinnerService.show();
  }
  return next(req).pipe(finalize(() => _SpinnerService.hide()));
};
