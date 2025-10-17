import { Component, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product, ProductService } from '../../../core/services/product.service';
import { InvoiceService } from '../../../core/services/invoice.service';
import { InvoiceViewComponent } from '../invoice-view/invoice-view.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ExternalApiService } from '../../../core/services/external-api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatTable,
    MatDialogModule,
  ],
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss'],
})
export class InvoiceFormComponent {
  invoiceForm: FormGroup;
  displayedColumns: string[] = ['code', 'name', 'quantity', 'price', 'subtotal', 'actions'];

  subtotal = signal(0);
  igv = signal(0);
  total = signal(0);

  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private externalApiService = inject(ExternalApiService);
  private invoiceService = inject(InvoiceService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  @ViewChild('invoiceTable') table!: MatTable<any>;

  constructor() {
    this.invoiceForm = this.fb.group({
      customer: this.fb.group({
        docType: ['DNI', Validators.required],
        docNumber: ['', Validators.required],
        name: ['', Validators.required],
      }),
      newItem: this.fb.group({
        productCode: [''],
        quantity: [1, [Validators.required, Validators.min(1)]],
      }),
      items: this.fb.array([], Validators.required),
    });

    this.items.valueChanges.subscribe(() => this.calculateTotals());
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  searchCustomer(): void {
    const docType = this.invoiceForm.get('customer.docType')?.value;
    const docNumber = this.invoiceForm.get('customer.docNumber')?.value;

    if (!docNumber) return;

    const apiCall =
      docType === 'DNI'
        ? this.externalApiService.getDni(docNumber)
        : this.externalApiService.getRuc(docNumber);

    apiCall.subscribe({
      next: (data) => {
        const customerName = data.full_name || data.razon_social || '';
        this.invoiceForm.get('customer.name')?.setValue(customerName);
        this.showNotification('Cliente encontrado con éxito.');
      },
      error: () => {
        this.invoiceForm.get('customer.name')?.setValue('');
        this.showNotification('No se pudo encontrar el cliente.', 'error');
      },
    });
  }

  addProduct(): void {
    const productCode = this.invoiceForm.get('newItem.productCode')?.value;
    if (!productCode) return;

    this.productService.getProductByCode(productCode).subscribe({
      next: (product) => {
        if (product) {
          const quantity = this.invoiceForm.get('newItem.quantity')?.value;
          const newItemForm = this.fb.group({
            code: [product.code],
            name: [product.name],
            quantity: [quantity],
            price: [product.price],
            subtotal: [product.price * quantity],
          });

          this.items.push(newItemForm);

          if (this.table) {
            this.table.renderRows();
          }

          this.invoiceForm.get('newItem')?.reset({ quantity: 1, productCode: '' });
        } else {
          this.showNotification('Producto no encontrado.', 'error');
        }
      },
      error: (err) => {
        console.error('Error al buscar el producto:', err);
        this.showNotification('Producto no encontrado o error en el servidor.', 'error');
      },
    });
  }

  removeItem(index: number): void {
    this.items.removeAt(index);

    if (this.table) {
      this.table.renderRows();
    }
  }

  calculateTotals(): void {
    const itemsValue = this.items.getRawValue();
    const sub = itemsValue.reduce((acc, item) => acc + item.subtotal, 0);
    const calculatedIgv = sub * 0.18;

    this.subtotal.set(sub);
    this.igv.set(calculatedIgv);
    this.total.set(sub + calculatedIgv);
  }

  createInvoice(): void {
    if (this.invoiceForm.invalid) {
      this.showNotification('El formulario contiene errores. Por favor, revísalo.', 'error');
      return;
    }

    const customerData = this.invoiceForm.get('customer')?.value;
    const itemsData = this.items.getRawValue();

    const payload = {
      invoice_type: customerData.docType === 'DNI' ? 'BOLETA' : 'FACTURA',
      customer_name: customerData.name,
      customer_document: customerData.docNumber,
      total: this.total(),
      items: itemsData.map((item) => ({
        code: item.code,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    this.invoiceService.createInvoice(payload).subscribe({
      next: (response) => {
        this.showNotification('Factura generada con éxito!');
        const viewData = {
          ...payload,
          subtotal: this.subtotal(),
          igv: this.igv(),
          emissionDate: new Date(),
        };

        this.dialog.open(InvoiceViewComponent, {
          width: '800px',
          data: viewData,
        });

        this.invoiceForm.reset();
        this.items.clear();
        if (this.table) {
          this.table.renderRows();
        }
      },
      error: (err) => {
        console.error('Error al crear la factura:', err);
        this.showNotification('Hubo un error al generar la factura.', 'error');
      },
    });
  }

  showNotification(message: string, panelClass: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass === 'success' ? 'success-snackbar' : 'error-snackbar'],
    });
  }
}
