import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { WorkerJson, WarehouseJson } from '../json';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  private baseUrl = `${environment.apiUrl}/workers`;

  constructor(private http: HttpClient, private authService: AuthService) {}

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

  getById(id: number): Observable<WorkerJson> {
    this.authService.updateToken();
    return this.http.get<WorkerJson>(`${this.baseUrl}/${id}`, { headers: this.headers });
  }

  createWorker(worker: WorkerJson): Observable<WorkerJson> {
    this.authService.updateToken();
    return this.http.post<WorkerJson>(this.baseUrl, worker, { headers: this.headers });
  }

  deleteWorker(id: number): Observable<void> {
    this.authService.updateToken();
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.headers });
  }

  hireWorker(id: number): Observable<any> {
    this.authService.updateToken();
    return this.http.post(`${this.baseUrl}/${id}/hire`, null, { headers: this.headers });
  }

  fireWorker(id: number): Observable<any> {
    this.authService.updateToken();
    return this.http.post(`${this.baseUrl}/${id}/fire`, null, { headers: this.headers });
  }

  rejectWorker(id: number): Observable<any> {
    this.authService.updateToken();
    return this.http.post(`${this.baseUrl}/${id}/reject`, null, { headers: this.headers });
  }
}
