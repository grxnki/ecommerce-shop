// src/app/app.routes.ts --- FINALE VERSION MIT KORREKTEN PFADEN ---

import { Routes } from '@angular/router';

// Pfade basierend auf deiner exakten Ordnerstruktur
import { ProductListComponent } from './product-list/product-list';
import { ProductDetailComponent } from './product-detail/product-detail';
import { RegisterComponent } from './pages/register/register';
import { LoginComponent } from './pages/login/login';
import { CartComponent } from './pages/cart/cart';
import { MyOrdersComponent } from './pages/my-orders/my-orders';
import { AdminOrdersComponent } from './pages/admin-orders/admin-orders';
import { adminGuard } from './guards/admin-guard';                   // Korrekter Pfad mit Bindestrich

export const routes: Routes = [
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cart', component: CartComponent },
  { path: 'my-orders', component: MyOrdersComponent },

  // Geschützte Admin-Route
  {
    path: 'admin/orders',
    component: AdminOrdersComponent,
    canActivate: [adminGuard]
  },

  // Standard-Umleitung
  { path: '', redirectTo: '/products', pathMatch: 'full' }
];
