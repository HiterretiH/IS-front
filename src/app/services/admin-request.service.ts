import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface AdminRequest {
  userId: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminRequestService {
  private readonly baseUrl: string = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient,
              private authService: AuthService
  ) {}

  getAllRequests(): Observable<AdminRequest[]> {
    this.authService.updateToken();
    return this.http.get<AdminRequest[]>(`${this.baseUrl}/requests/list`, {headers: this.authService.headers});
  }

  sendRequest(username: string): Observable<string> {
    this.authService.updateToken();
    return this.http.post<string>(`${this.baseUrl}/requests/new?username=${username}`, null, {headers: this.authService.headers});
  }

  approveRequest(userId: number): Observable<string> {
    this.authService.updateToken();
    return this.http.post<string>(`${this.baseUrl}/requests/${userId}/approve`, null, {headers: this.authService.headers});
  }

  rejectRequest(userId: number): Observable<string> {
    this.authService.updateToken();
    return this.http.post<string>(`${this.baseUrl}/requests/${userId}/reject`, null, {headers: this.authService.headers});
  }
}
