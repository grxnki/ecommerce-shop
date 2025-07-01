// src/app/services/cart.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth'; // Wir brauchen den AuthService für den Token

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items: any[] = [];
  private httpClient = inject(HttpClient);
  private authService = inject(AuthService); // AuthService holen
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

  // NEUE METHODE: Bestellung aufgeben
  placeOrder(): Observable<any> {
    const token = this.authService.getToken(); // Token vom AuthService holen

    // Wichtig: Wir müssen den Token im Header der Anfrage mitschicken
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
