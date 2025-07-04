// src/app/app.routes.ts --- FINALE KORREKTE VERSION ---

import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list';
import { ProductDetailComponent } from './product-detail/product-detail';
import { RegisterComponent } from './pages/register/register';
import { LoginComponent } from './pages/login/login';
import { CartComponent } from './pages/cart/cart';
import { MyOrdersComponent } from './pages/my-orders/my-orders'

export const routes: Routes = [
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cart', component: CartComponent },
  { path: 'my-orders', component: MyOrdersComponent }, // NEU
  { path: '', redirectTo: '/products', pathMatch: 'full' }
];
