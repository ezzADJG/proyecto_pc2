import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    // Si existe un token, el usuario puede acceder a la ruta.
    return true;
  } else {
    // Si no hay token, redirige al usuario al login.
    router.navigate(['/auth/login']);
    return false;
  }
};