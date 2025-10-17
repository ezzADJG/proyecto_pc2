import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../../core/services/product.service';

// Importaciones de Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
// Crearemos este componente de confirmación en un momento
// import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  public products = signal<Product[]>([]);
  public displayedColumns: string[] = ['code', 'name', 'price', 'stock', 'actions'];

  private productService = inject(ProductService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error('Error al cargar productos:', err),
    });
  }

  addProduct(): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '500px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.products.update((currentProducts) => [...currentProducts, result]);
        this.showNotification('Producto añadido con éxito.');
      }
    });
  }

  // --- AÑADE ESTA FUNCIÓN ---
  deleteProduct(product: Product): void {
    // --- Lógica de Confirmación (Opcional pero recomendado) ---
    // Por ahora, borraremos directamente. Luego podemos añadir un diálogo.
    if (!confirm(`¿Estás seguro de que quieres eliminar el producto "${product.name}"?`)) {
      return;
    }

    if (product.id) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          // Actualiza la lista en el frontend para reflejar el cambio
          this.products.update((products) => products.filter((p) => p.id !== product.id));
          this.showNotification('Producto eliminado con éxito.');
        },
        error: (err) => {
          console.error('Error al eliminar el producto:', err);
          this.showNotification('Error al eliminar el producto.', 'error');
        },
      });
    }
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
