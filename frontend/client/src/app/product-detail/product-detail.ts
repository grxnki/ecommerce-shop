// src/app/product-detail/product-detail.ts --- FINALE, KORRIGIERTE VERSION ---

// ALLE NÖTIGEN IMPORTE SIND HIER:
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { CartService } from '../services/cart';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit {
  // inject, ActivatedRoute etc. werden jetzt erkannt, weil sie oben importiert sind
  route: ActivatedRoute = inject(ActivatedRoute);
  httpClient = inject(HttpClient);
  cartService = inject(CartService);

  // Observable wird jetzt erkannt
  product$!: Observable<any>;

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.product$ = this.httpClient.get<any>(`http://localhost:3000/api/products/${productId}`);
    }
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }
}
