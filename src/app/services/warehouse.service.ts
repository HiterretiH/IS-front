import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { WarehouseJson } from '../json';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private baseUrl = `${environment.apiUrl}/warehouses`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private get headers() {
    this.authService.updateToken();
    return this.authService.headers;
  }

  getAll(page: number, size: number): Observable<{ data: any[], total: number }> {
    this.authService.updateToken();
    
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<{ data: any[], total: number }>(this.baseUrl, {
      params,
      headers: this.headers
    });
  }

  createWarehouse(warehouse: WarehouseJson): Observable<WarehouseJson> {
    this.authService.updateToken();
    return this.http.post<WarehouseJson>(`${this.baseUrl}`, warehouse, { headers: this.authService.headers });
  }

  getById(id: number): Observable<WarehouseJson> {
    this.authService.updateToken();
    return this.http.get<WarehouseJson>(`${this.baseUrl}/${id}`, { headers: this.authService.headers });
  }

  deleteWarehouse(id: number): Observable<void> {
    this.authService.updateToken();
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.authService.headers });
  }

  updateWarehouse(id: number, warehouse: WarehouseJson): Observable<WarehouseJson> {
    this.authService.updateToken();
    return this.http.put<WarehouseJson>(`${this.baseUrl}/update/${id}`, location, { headers: this.authService.headers });
  }
}
