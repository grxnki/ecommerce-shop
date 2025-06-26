// src/app/product-list/product-list.component.ts --- FINAL ---

import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink], // HIER HINZUFÜGEN! Das ist entscheidend.
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent {
  httpClient = inject(HttpClient);
  products$ = this.httpClient.get<any[]>('http://localhost:3000/api/products');
}