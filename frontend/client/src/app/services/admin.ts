// src/app/services/admin.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);
  private backendUrl = 'http://localhost:3000/api/admin';

  // Holt alle Bestellungen mit dem Admin-Token
  getAllOrders(): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.get<any[]>(`${this.backendUrl}/orders`, { headers });
  }
}
