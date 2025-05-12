import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('tkn_ai_prt');

  if (!token) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
