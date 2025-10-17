import { Component, ElementRef, Inject, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importaciones de Angular Material
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-invoice-view',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss'],
})
export class InvoiceViewComponent {
  // Obtenemos una referencia al contenedor del HTML que queremos convertir a PDF
  @ViewChild('invoiceContent') invoiceContent!: ElementRef;

  // Inyectamos MAT_DIALOG_DATA para recibir la información de la factura
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  public dialogRef = inject(MatDialogRef<InvoiceViewComponent>);

  downloadAsPDF(): void {
    const content = this.invoiceContent.nativeElement;

    // Usamos html2canvas para tomar una "foto" de nuestro HTML
    html2canvas(content).then((canvas) => {
      const imageData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' = portrait, 'mm' = milímetros, 'a4' = tamaño
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`comprobante-${this.data.customer_document}.pdf`);
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
