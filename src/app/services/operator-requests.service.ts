import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

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
    return { headers: this.authService.headers };
  }

  getAll(): Observable<OperatorRequest[]> {
    return this.http.get<OperatorRequest[]>(this.baseUrl, this.headers);
  }

  getAllMine(id: number): Observable<OperatorRequest[]> {
    return this.http.get<OperatorRequest[]>(`${this.baseUrl}/mine/${id}`, this.headers);
  }

  getById(id: number): Observable<OperatorRequest> {
    return this.http.get<OperatorRequest>(`${this.baseUrl}/${id}`, this.headers);
  }

  getByUsername(username: string): Observable<OperatorRequest> {
    return this.http.get<OperatorRequest>(`${this.baseUrl}/by-username?username=${username}`, this.headers);
  }

  create(id: string): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/${parseInt(id)}`, {
      headers: this.headers
    });
  }

  update(id: number, request: OperatorRequest): Observable<OperatorRequest> {
    return this.http.put<OperatorRequest>(`${this.baseUrl}/${id}`, request, this.headers);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.headers);
  }

  getAllPending(): Observable<OperatorRequest[]> {
    return this.http.get<OperatorRequest[]>(`${this.baseUrl}/pending`, this.headers);
  }

  approve(id: number): Observable<OperatorRequest> {
    return this.http.put<OperatorRequest>(`${this.baseUrl}/${id}/approve`, {}, this.headers);
  }

  reject(id: number): Observable<OperatorRequest> {
    return this.http.put<OperatorRequest>(`${this.baseUrl}/${id}/reject`, {}, this.headers);
  }
}
