import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);

  return authService.observe().pipe(
    map((authenticated) => {
      if (isPlatformBrowser(platformId)) {
        if (authenticated) {
          return true;
        }
        // Redirect to the sign-in page
        router.navigate([`auth/login`]);
        // Prevent the access
        return false;
      }

      return false;
    }),
    catchError((e) => {
      if (isPlatformBrowser(platformId)) {
        // Redirect to the sign-in page
        router.navigate([`auth/login`]);
        // Prevent the access
        return of(false);
      }

      return of(false);
    }),
  );
};
