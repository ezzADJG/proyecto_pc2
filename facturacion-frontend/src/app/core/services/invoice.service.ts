import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Invoice {
  id: string;
  invoice_type: string;
  customer_name: string;
  customer_document: string;
  total: number;
  created_at: string;
}

export interface InvoicePayload {
  invoice_type: string; // 'BOLETA' o 'FACTURA'
  customer_name: string;
  customer_document: string;
  total: number;
  items: {
    code: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiUrl = 'http://localhost:3000/api/invoices';
  private http = inject(HttpClient);

  createInvoice(invoiceData: InvoicePayload): Observable<any> {
    return this.http.post(this.apiUrl, invoiceData);
  }
  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }
  getInvoiceById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
