import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {AuthService} from "./auth.service";
import { LocationJson } from '../json';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
    private baseUrl = `${environment.apiUrl}/locations`;

  constructor(private http: HttpClient, private authService: AuthService) {}

    private get headers() {
        this.authService.updateToken();
        return this.authService.headers;
    }
  getLocations(): Observable<LocationJson[]> {
    this.authService.updateToken();
    return this.http.get<LocationJson[]>(`${this.baseUrl}/list`, { headers: this.authService.headers });
  }

  getById(id: number): Observable<LocationJson> {
    this.authService.updateToken();
    return this.http.get<LocationJson>(`${this.baseUrl}/get/${id}`, { headers: this.authService.headers });
  }

    getAll(page: number, size: number): Observable<{data: any[], total: number}> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<{data: any[], total: number}>(this.baseUrl, {
            params,
            headers: this.headers
        });
    }
  createLocation(location: LocationJson): Observable<LocationJson> {
    this.authService.updateToken();
    return this.http.post<LocationJson>(`${this.baseUrl}`, location, { headers: this.authService.headers });
  }

  updateLocation(id: number, location: LocationJson): Observable<LocationJson> {
    this.authService.updateToken();
    return this.http.put<LocationJson>(`${this.baseUrl}/update/${id}`, location, { headers: this.authService.headers });
  }

  deleteLocation(id: number): Observable<void> {
    this.authService.updateToken();
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`, { headers: this.authService.headers });
  }
}