import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loggedinGuard: CanActivateFn = () => {
  const _AuthService = inject(AuthService);
  const _Router = inject(Router);
  if (_AuthService.getToken() !== null) {
    return true;
  }
  _Router.navigate(['/home']);
  return false;
};
