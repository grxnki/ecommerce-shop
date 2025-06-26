// src/app/product-detail/product-detail.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router'; // RouterLink für den "Zurück"-Button
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink], // RouterLink hier importieren
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetailComponent implements OnInit {
  // Wir holen uns die Tools, die wir brauchen
  route: ActivatedRoute = inject(ActivatedRoute);
  httpClient = inject(HttpClient);

  // Eine Variable, die die Daten des Produkts als "Datenstrom" (Observable) halten wird
  product$!: Observable<any>;

  ngOnInit(): void {
    // Beim Initialisieren der Komponente...
    // ...lesen wir die 'id' aus der URL
    const productId = this.route.snapshot.paramMap.get('id');

    // Wenn eine ID da ist...
    if (productId) {
      // ...rufen wir die neue Backend-API auf und speichern den Datenstrom
      this.product$ = this.httpClient.get<any>(`http://localhost:3000/api/products/${productId}`);
    }
  }
}