// src/app/pages/cart/cart.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { Router } from '@angular/router'; // 1. Wichtiger Import für den Router

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent {
  cartService = inject(CartService);
  router = inject(Router); // 2. Den Router hier "holen", damit wir ihn benutzen können

  getTotalPrice(): number {
    return this.cartService.getItems().reduce((total, item) => total + item.price, 0);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  checkout(): void {
    this.cartService.placeOrder().subscribe({
      next: (response) => {
        alert('Vielen Dank für deine Bestellung!');
        this.cartService.clearCart();
        // Diese Zeile funktioniert jetzt, weil 'this.router' existiert
        this.router.navigate(['/products']);
      },
      error: (err) => {
        alert('Fehler bei der Bestellung. Bitte versuche es erneut.');
        console.error('Checkout-Fehler:', err);
      }
    });
  }
}
