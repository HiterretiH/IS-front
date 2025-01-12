import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CoordinatesJson {
    id: number;
    x: number;
    y: number;
}

@Injectable({
    providedIn: 'root'
})
export class CoordinatesService {
    private apiUrl = environment.apiUrl + '/coordinates';

    constructor(private http: HttpClient) {}

    getCoordinates(): Observable<CoordinatesJson[]> {
        return this.http.get<CoordinatesJson[]>(this.apiUrl);
    }

    createCoordinates(coordinates: CoordinatesJson): Observable<CoordinatesJson> {
        return this.http.post<CoordinatesJson>(this.apiUrl, coordinates);
    }
}
