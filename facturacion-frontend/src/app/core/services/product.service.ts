import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definimos una interfaz para tipar nuestros productos y tener un código más limpio
export interface Product {
  id?: string;
  code: string;
  name: string;
  price: number;
  stock: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';
  private http = inject(HttpClient);

  // Obtener todos los productos del usuario
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Crear un nuevo producto
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  getProductByCode(code: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${code}`);
  }
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // TODO: Añadir métodos para actualizar y eliminar productos
}
