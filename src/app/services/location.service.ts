import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LocationJson {
    id: number;
    x: number;
    y: number;
    z?: number;
}

@Injectable({
    providedIn: 'root',
})
export class LocationService {
    private apiUrl = `${environment.apiUrl}/locations`;

    constructor(private http: HttpClient) {}

    getLocations(): Observable<LocationJson[]> {
        return this.http.get<LocationJson[]>(this.apiUrl);
    }

    createLocation(location: LocationJson): Observable<LocationJson> {
        return this.http.post<LocationJson>(this.apiUrl, location);
    }
}
