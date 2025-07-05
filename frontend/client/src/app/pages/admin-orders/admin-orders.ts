// src/app/pages/admin/orders/orders.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin'; // KORRIGIERTER PFAD
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-orders.html',
  styleUrls: ['./admin-orders.css']
})
export class AdminOrdersComponent implements OnInit {
  private adminService = inject(AdminService);
  orders$!: Observable<any[]>;

  ngOnInit(): void {
    this.orders$ = this.adminService.getAllOrders();
  }
}
