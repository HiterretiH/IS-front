import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment.development";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class WorkerService {
    private baseUrl = `${environment.apiUrl}/workers`;

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
