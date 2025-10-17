import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product, ProductService } from '../../../core/services/product.service';

// Importaciones de Angular Material para el Diálogo
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss'],
})
export class ProductDialogComponent {
  productForm: FormGroup;

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  public dialogRef = inject(MatDialogRef<ProductDialogComponent>);

  // Usamos MAT_DIALOG_DATA para recibir datos (en un futuro para editar)
  constructor(@Inject(MAT_DIALOG_DATA) public data: { product?: Product }) {
    this.productForm = this.fb.group({
      code: [data?.product?.code || '', Validators.required],
      name: [data?.product?.name || '', Validators.required],
      price: [data?.product?.price || '', [Validators.required, Validators.min(0)]],
      stock: [data?.product?.stock || '', [Validators.required, Validators.min(0)]],
    });
  }

  onSave(): void {
    if (this.productForm.invalid) {
      return;
    }

    // Llamamos al servicio para crear el producto
    this.productService.createProduct(this.productForm.value).subscribe({
      next: (newProduct) => {
        // Cerramos el diálogo y devolvemos el nuevo producto
        this.dialogRef.close(newProduct);
      },
      error: (err) => console.error('Error al crear el producto:', err),
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
