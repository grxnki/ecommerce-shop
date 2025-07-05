// src/app/layout/layout.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';

// NEUE IMPORTE FÜR MATERIAL DESIGN
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-layout',
  standalone: true,
  // Hier die neuen Module hinzufügen
  imports: [CommonModule, RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class LayoutComponent {
  authService = inject(AuthService);
  isLoggedIn$ = this.authService.getLoginStatus();
}
