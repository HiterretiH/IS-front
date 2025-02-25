import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment.development";
import { AuthService } from "./auth.service";
import { SortingStationJson } from '../json';

@Injectable({
    providedIn: 'root'
})
export class SortingStationService {
    private baseUrl = `${environment.apiUrl}/sorting-stations`;

    constructor(private http: HttpClient, private authService: AuthService) { }

    private get headers() {
        this.authService.updateToken();
        return this.authService.headers;
    }

    getAll(page: number, size: number): Observable<{ data: any[], total: number }> {
        this.authService.updateToken();

        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<{ data: any[], total: number }>(this.baseUrl, {
            params,
            headers: this.headers
        });
    }

    getById(id: number): Observable<SortingStationJson> {
        this.authService.updateToken();
        return this.http.get<SortingStationJson>(`${this.baseUrl}/${id}`);
    }

    create(sortingStation: SortingStationJson): Observable<void> {
        this.authService.updateToken();
        return this.http.post<void>(this.baseUrl, sortingStation);
    }

    delete(id: number): Observable<void> {
        this.authService.updateToken();
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    simulateSort(id: number): Observable<void> {
        this.authService.updateToken();
        return this.http.post<void>(`${this.baseUrl}/${id}/simulate-sort`, {});
    }
}
