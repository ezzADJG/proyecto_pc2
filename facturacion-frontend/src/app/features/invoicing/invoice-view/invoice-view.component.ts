import { Component, ElementRef, Inject, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  @ViewChild('invoiceContent') invoiceContent!: ElementRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  public dialogRef = inject(MatDialogRef<InvoiceViewComponent>);

  downloadAsPDF(): void {
    const content = this.invoiceContent.nativeElement;

    html2canvas(content).then((canvas) => {
      const imageData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
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
