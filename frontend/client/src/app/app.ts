// src/app/app.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './services/auth'; // AuthService importieren

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  authService = inject(AuthService); // AuthService holen
  // Wir holen uns den Login-Status als Observable, damit unser Template ihn nutzen kann
  isLoggedIn$ = this.authService.getLoginStatus();
}
