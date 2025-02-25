import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {AuthService} from "./auth.service";
import {ProductTypeJson} from '../json';

@Injectable({
    providedIn: 'root',
})
export class OperatorService {
    private baseUrl = `${environment.apiUrl}/warehouse-operators`;

    constructor(private http: HttpClient, private authService: AuthService) {}

    private get headers() {
        this.authService.updateToken();
        return this.authService.headers;
    }

    getProductTypeByUserId(id: number): Observable<ProductTypeJson> {
        this.authService.updateToken();
        return this.http.get<ProductTypeJson>(`${this.baseUrl}/product-type-by-user/${id}`, { headers: this.authService.headers });
    }
}