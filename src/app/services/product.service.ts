import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment.development";
import { AuthService } from "./auth.service";
import { ProductJson } from '../json';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private baseUrl = `${environment.apiUrl}/products`;

    constructor(private http: HttpClient, private authService: AuthService) { }

    private get headers() {
        this.authService.updateToken();
        return this.authService.headers;
    }

    getProducts(page: number, size: number): Observable<{ data: any[], total: number }> {
        this.authService.updateToken();

        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<{ data: any[], total: number }>(this.baseUrl, {
            params,
            headers: this.headers
        });
    }

    createProduct(product: any): Observable<any> {
        console.log(product);
        this.authService.updateToken();
        return this.http.post<any>(`${this.baseUrl}`, product, { headers: this.headers });
    }

    getById(id: number): Observable<ProductJson> {
        this.authService.updateToken();
        return this.http.get<ProductJson>(`${this.baseUrl}/${id}`, { headers: this.headers });
    }

    disposeProduct(id: number): Observable<any> {
        this.authService.updateToken();
        return this.http.put<any>(`${this.baseUrl}/${id}/dispose`, {}, { headers: this.headers });
    }

    sortToShip(id: number, stationId: number): Observable<any> {
        this.authService.updateToken();
        return this.http.put<any>(`${this.baseUrl}/${id}/sort-to-ship/${stationId}`, {}, { headers: this.headers });
    }

    sortToStore(id: number, stationId: number): Observable<any> {
        this.authService.updateToken();
        return this.http.put<any>(`${this.baseUrl}/${id}/sort-to-store/${stationId}`, {}, { headers: this.headers });
    }

    setProductPriority(id: number, priority: number): Observable<any> {
        this.authService.updateToken();
        const params = new HttpParams().set('priority', priority.toString());
        return this.http.put<any>(`${this.baseUrl}/${id}/priority`, {}, { headers: this.headers, params });
    }
}
