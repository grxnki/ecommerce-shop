// src/app/pages/my-orders/my-orders.ts --- KORREKTER IMPORT ---

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth'; // HIER IST DER KORRIGIERTE PFAD
import { Observable } from 'rxjs';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-orders.html',
  styleUrls: ['./my-orders.css']
})
export class MyOrdersComponent implements OnInit {
  httpClient = inject(HttpClient);
  authService = inject(AuthService);

  orders$!: Observable<any[]>;

  ngOnInit(): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.orders$ = this.httpClient.get<any[]>('http://localhost:3000/api/orders/my-orders', { headers: headers });
  }
}
