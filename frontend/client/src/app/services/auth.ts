// src/app/services/auth.ts --- KORREKTE VERSION ---

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private backendUrl = 'http://localhost:3000/api/users';

  private isLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor() {
    const token = this.getToken();
    if (token) {
      this.isLoggedIn$.next(true);
    }
  }

  getLoginStatus(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  register(userData: any): Observable<any> {
    return this.httpClient.post(`${this.backendUrl}/register`, userData);
  }

  login(userData: any): Observable<any> {
    return this.httpClient.post<{ token: string }>(`${this.backendUrl}/login`, userData).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          this.isLoggedIn$.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.isLoggedIn$.next(false);
    this.router.navigate(['/login']);
  }

  public isAdmin(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      // Wir dekodieren den Token, um an den Payload (die Daten) zu kommen
      const decodedToken: { user: { id: string, role?: string } } = jwtDecode(token);
      // Wir prüfen, ob die Rolle 'admin' ist
      return decodedToken.user.role === 'admin';
    } catch (error) {
      // Wenn der Token ungültig ist, ist der Benutzer auch kein Admin
      return false;
    }
  }
}
