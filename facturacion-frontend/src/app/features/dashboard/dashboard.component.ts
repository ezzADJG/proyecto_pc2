import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatGridListModule, CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  stats = signal<any[]>([]);
  private dashboardService = inject(DashboardService);

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe((data) => {
      this.stats.set([
        { title: 'Ventas Totales', value: data.totalSales, icon: 'payments', isCurrency: true },
        { title: 'Facturas Emitidas', value: data.invoicesCount, icon: 'receipt' },
        { title: 'Productos Activos', value: data.productsCount, icon: 'inventory' },
      ]);
    });
  }
}
