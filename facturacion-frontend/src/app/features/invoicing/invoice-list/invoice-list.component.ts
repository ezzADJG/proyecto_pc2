import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Invoice, InvoiceService } from '../../../core/services/invoice.service';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InvoiceViewComponent } from '../invoice-view/invoice-view.component';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
})
export class InvoiceListComponent implements OnInit {
  public invoices = signal<Invoice[]>([]);
  public displayedColumns: string[] = ['type', 'customer', 'document', 'date', 'total', 'actions'];

  private invoiceService = inject(InvoiceService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.invoiceService.getInvoices().subscribe({
      next: (data) => this.invoices.set(data),
      error: (err) => console.error('Error al cargar las facturas:', err),
    });
  }

  viewInvoice(invoice: Invoice): void {
    this.invoiceService.getInvoiceById(invoice.id).subscribe({
      next: (invoiceDetails) => {
      
        const transformedItems = invoiceDetails.items.map((item: any) => {
          return {
            
            code: item.product_code,
            name: item.product_name,
            quantity: item.quantity,
            price: item.unit_price,
          };
        });

        const total = invoiceDetails.total;
        const subtotal = total / 1.18;
        const igv = total - subtotal;

        const viewData = {
          invoice_type: invoiceDetails.invoice_type,
          customer_name: invoiceDetails.customer_name,
          customer_document: invoiceDetails.customer_document,
          items: transformedItems,
          subtotal: subtotal,
          igv: igv,
          total: total,
          emissionDate: new Date(invoiceDetails.created_at),
        };

        this.dialog.open(InvoiceViewComponent, {
          width: '800px',
          data: viewData,
        });
      },
      error: (err) => console.error('Error al obtener el detalle de la factura', err),
    });
  }
}
