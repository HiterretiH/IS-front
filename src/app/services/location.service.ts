import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {AuthService} from "./auth.service";

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
    private baseUrl = `${environment.apiUrl}/locations`;

    constructor(private http: HttpClient, private authService: AuthService) {}

    private get headers() {
        this.authService.updateToken();
        return this.authService.headers;
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
}
