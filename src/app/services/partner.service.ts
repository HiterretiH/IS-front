import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { PartnerJson } from '../json';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private baseUrl = `${environment.apiUrl}/partners`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  private get headers() {
    this.authService.updateToken();
    return this.authService.headers;
  }

  getAll(page: number, size: number): Observable<{ data: any[], total: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<{ data: any[], total: number }>(this.baseUrl, {
      params,
      headers: this.headers
    });
  }

  createPartner(partner: PartnerJson): Observable<PartnerJson> {
    this.authService.updateToken();
    return this.http.post<PartnerJson>(`${this.baseUrl}`, partner, { headers: this.authService.headers });
  }

  getById(id: number): Observable<PartnerJson> {
    this.authService.updateToken();
    return this.http.get<PartnerJson>(`${this.baseUrl}/${id}`, { headers: this.authService.headers });
  }

  deletePartner(id: number): Observable<void> {
    this.authService.updateToken();
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.authService.headers });
  }
}
