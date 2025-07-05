// src/app/product-list/product-list.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ CommonModule, RouterLink, MatCardModule ],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent {
  httpClient = inject(HttpClient);
  products$ = this.httpClient.get<any[]>('http://localhost:3000/api/products');
}
