import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment.development";
import { AuthService } from "./auth.service";
import {ProductJson, QueueJson} from '../json';

@Injectable({
    providedIn: 'root'
})
export class QueueService {
    private baseUrl = `${environment.apiUrl}/queues`;

    constructor(private http: HttpClient, private authService: AuthService) {}

    private get headers() {
        this.authService.updateToken();
        return this.authService.headers;
    }

    getAll(page: number, size: number): Observable<{data: any[], total: number}> {
        this.authService.updateToken();
        
        const params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<{data: any[], total: number}>(this.baseUrl, {
            params,
            headers: this.headers
        });
    }

    getById(id: number): Observable<QueueJson> {
        this.authService.updateToken();
        return this.http.get<QueueJson>(`${this.baseUrl}/${id}`, {headers: this.headers});
    }

    updateQueue(id: number, queue: QueueJson): Observable<QueueJson> {
        this.authService.updateToken();
        return this.http.put<QueueJson>(`${this.baseUrl}/${id}`, queue, { headers: this.headers});
    }

      createQueue(queue: any): Observable<any> {
        console.log(queue);
        this.authService.updateToken();
        return this.http.post<any>(`${this.baseUrl}`, queue, {headers: this.headers});
      }

      delete(id: number): Observable<void> {
        this.authService.updateToken();
        return this.http.delete<void>(`${this.baseUrl}/${id}`, {headers: this.headers});
    }
}
