import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExternalApiService {
  private apiUrl = 'http://localhost:3000/api/external';
  private http = inject(HttpClient);

  // Obtener datos por DNI
  getDni(dni: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/dni/${dni}`);
  }

  // Obtener datos por RUC
  getRuc(ruc: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/ruc/${ruc}`);
  }
}
