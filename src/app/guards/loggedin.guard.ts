import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { toast } from 'ngx-sonner';

export const loggedinGuard: CanActivateFn = () => {
  const _AuthService = inject(AuthService);
  const _PLATFORM_ID = inject(PLATFORM_ID);
  const _Router = inject(Router);
  if (_AuthService.getToken() !== null) {
    return true;
  }
  if (isPlatformBrowser(_PLATFORM_ID)) {
    toast.error('You Must Log In First');
  }
  _Router.navigate(['/home']);
  return false;
};
