// src/app/guards/admin.guard.ts --- KORRIGIERTER IMPORT ---

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth'; // Hier ist der korrekte Pfad

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true; // Zugriff erlaubt
  } else {
    // Wenn kein Admin, leite zur Startseite um
    router.navigate(['/']);
    return false; // Zugriff verweigert
  }
};
