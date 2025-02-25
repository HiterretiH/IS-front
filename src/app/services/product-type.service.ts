import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment.development";
import { AuthService } from "./auth.service";

export interface ProductType {
    id: number;
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProductTypeService {
    private baseUrl = `${environment.apiUrl}/product-types`;

    constructor(private http: HttpClient, private authService: AuthService) { }

    private get headers() {
        this.authService.updateToken();
        return this.authService.headers;
    }

    getProductTypes(page: number, size: number): Observable<{ data: any[], total: number }> {
        this.authService.updateToken();

        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<{ data: any[], total: number }>(this.baseUrl, {
            params,
            headers: this.headers
        });
    }

    getById(id: number): Observable<ProductType> {
        this.authService.updateToken();
        return this.http.get<ProductType>(`${this.baseUrl}/${id}`, { headers: this.headers });
    }
}
