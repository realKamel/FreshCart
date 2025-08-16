import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const _AuthService = inject(AuthService);
  const _Router = inject(Router);
  if (_AuthService.isLoggedIn()) {
    _Router.navigate(['/home']);
    return false;
  }
  return true;
};
