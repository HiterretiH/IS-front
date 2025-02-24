import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getLocations(): Observable<LocationJson[]> {
    this.authService.updateToken();
    return this.http.get<LocationJson[]>(`${this.apiUrl}/list`, { headers: this.authService.headers });
  }

  getById(id: number): Observable<LocationJson> {
    this.authService.updateToken();
    return this.http.get<LocationJson>(`${this.apiUrl}/get/${id}`, { headers: this.authService.headers });
  }

  createLocation(location: LocationJson): Observable<LocationJson> {
    this.authService.updateToken();
    return this.http.post<LocationJson>(`${this.apiUrl}`, location, { headers: this.authService.headers });
  }

  updateLocation(id: number, location: LocationJson): Observable<LocationJson> {
    this.authService.updateToken();
    return this.http.put<LocationJson>(`${this.apiUrl}/update/${id}`, location, { headers: this.authService.headers });
  }

  deleteLocation(id: number): Observable<void> {
    this.authService.updateToken();
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, { headers: this.authService.headers });
  }
}
