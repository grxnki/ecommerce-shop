// src/app/services/cart.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// HIER importieren wir jetzt alles Nötige von RxJS, inklusive "throwError"
import { Observable, throwError, tap } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items: any[] = [];
  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);
  private backendUrl = 'http://localhost:3000/api/orders';

  constructor() { }

  addToCart(product: any) {
    this.items.push(product);
    console.log('Aktueller Warenkorb:', this.items);
    alert(`${product.name} wurde zum Warenkorb hinzugefügt!`);
  }

  getItems() {
    return this.items;
  }

  // Wir benutzen hier jetzt das importierte "throwError"
  placeOrder(): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      console.error('FEHLER: Kein Token gefunden! Der Benutzer ist wahrscheinlich nicht richtig eingeloggt.');
      // Wir erstellen ein "fehlerhaftes" Observable und geben es zurück.
      return throwError(() => new Error('Kein Authentifizierungs-Token gefunden.'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const orderData = {
      products: this.getItems(),
      totalPrice: this.getItems().reduce((total, item) => total + item.price, 0)
    };

    return this.httpClient.post(this.backendUrl, orderData, { headers: headers });
  }

  clearCart() {
    this.items = [];
    return this.items;
  }
}
