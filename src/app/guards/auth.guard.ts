import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const token = localStorage.getItem('token');
  const router = inject(Router);
  const authService = inject(AuthService);

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userRole = decodedToken.role;
    const userId = decodedToken.id;

    authService.setUserId(userId);

    console.log('user id: ', userId);
    console.log('user role in auth guard: ', userRole);
    console.log('user name: ', decodedToken.sub);

    const requiredRole = route.data['role'];
    console.log('required role: ', requiredRole);
    console.log('user role in token: ', userRole);

    if (requiredRole && userRole !== requiredRole) {
      router.navigate(['/login']);
      return false;
    }



  } catch (e) {
    console.error('Error decoding token: ', e);
    router.navigate(['/login']);
    return false;
  }
  return true;
};
