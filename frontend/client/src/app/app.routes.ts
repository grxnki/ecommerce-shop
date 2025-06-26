// src/app/app.routes.ts --- KORREKTUR ---

import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list';
// KORREKTUR HIER: Der Klassenname endet auf 'Component'
import { ProductDetailComponent } from './product-detail/product-detail';

export const routes: Routes = [
    { path: 'products', component: ProductListComponent },
    // UND KORREKTUR HIER: Wir verwenden den korrekten Komponentennamen
    { path: 'products/:id', component: ProductDetailComponent },
    { path: '', redirectTo: '/products', pathMatch: 'full' }
];