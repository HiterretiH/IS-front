import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { LocationJson } from '../json';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private apiUrl = `${environment.apiUrl}/locations`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private get headers() {
    this.authService.updateToken();
    return this.authService.headers;
  }

  getLocations(page: number, size: number): Observable<{ data: LocationJson[]; total: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<{ data: LocationJson[]; total: number }>(`${this.apiUrl}`, {
      params,
      headers: this.headers,
    });
  }

  getById(id: number): Observable<LocationJson> {
    return this.http.get<LocationJson>(`${this.apiUrl}/get/${id}`, { headers: this.headers });
  }

  createLocation(location: LocationJson): Observable<LocationJson> {
    return this.http.post<LocationJson>(`${this.apiUrl}`, location, { headers: this.headers });
  }

  updateLocation(id: number, location: LocationJson): Observable<LocationJson> {
    return this.http.put<LocationJson>(`${this.apiUrl}/update/${id}`, location, { headers: this.headers });
  }

  deleteLocation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, { headers: this.headers });
  }
}
