import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import {ProductType} from "./product-type.service";

export interface OperatorRequest {
  id: number;
  status: string;
  createdAt: number[];
  operator: Object;
}

@Injectable({
  providedIn: 'root'
})
export class OperatorRequestsService {
  private baseUrl = `${environment.apiUrl}/operator-requests`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private get headers() {
    this.authService.updateToken();
    return this.authService.headers;
  }

  getAll(): Observable<OperatorRequest[]> {
    return this.http.get<OperatorRequest[]>(this.baseUrl, {headers: this.headers});
  }

  getAllMine(id: number): Observable<OperatorRequest[]> {
    return this.http.get<OperatorRequest[]>(`${this.baseUrl}/mine/${id}`, {headers: this.headers});
  }

  getById(id: number): Observable<OperatorRequest> {
    return this.http.get<OperatorRequest>(`${this.baseUrl}/${id}`, {headers: this.headers});
  }

  getByUsername(username: string): Observable<OperatorRequest> {
    return this.http.get<OperatorRequest>(`${this.baseUrl}/by-username?username=${username}`, {headers: this.headers});
  }

  create(id: string): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/${parseInt(id)}`, {
      headers: this.headers
    });
  }

  update(id: number, request: OperatorRequest): Observable<OperatorRequest> {
    return this.http.put<OperatorRequest>(`${this.baseUrl}/${id}`, request, {headers: this.headers});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {headers: this.headers});
  }

  getAllPending(): Observable<OperatorRequest[]> {
    return this.http.get<OperatorRequest[]>(`${this.baseUrl}/pending`, {headers: this.headers});
  }

  approve(id: number, productTypeId: number): Observable<ArrayBuffer> {
    const params = new HttpParams().set('productTypeId', productTypeId.toString());
    return this.http.put<ArrayBuffer>(`${this.baseUrl}/${id}/approve`, null, {
      params,
      headers: this.headers,
    });
  }

  reject(id: number): Observable<OperatorRequest> {
    return this.http.put<OperatorRequest>(`${this.baseUrl}/${id}/reject`, {}, {headers: this.headers});
  }
}
