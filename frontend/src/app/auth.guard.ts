import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; 

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem("jwtToken");

  if (token) {
    const decodedToken = jwtDecode(token); 
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      localStorage.removeItem('jwtToken');
      router.navigate(['/']); 
      return false;
    }

    return true;  
  } else {
    router.navigate(['/']);
    return false;
  }
};
