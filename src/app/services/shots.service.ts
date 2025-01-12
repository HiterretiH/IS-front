import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { of, filter, map, pipe } from 'rxjs';

export interface Shot {
  x: number,
  y: number,
  r: number, 
  hit: boolean,
  time: string
}

export interface Dot {
  x: number,
  y: number,
  r: number
}

@Injectable({
  providedIn: 'root'
})
export class ShotsService {
  private headers: HttpHeaders = new HttpHeaders;

  constructor(private auth: AuthService,
              private http: HttpClient) 
  { }

  public updateToken(): void {
    this.headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth.token}`
    });
  }

  public getShots(): Observable<Shot[]> {
    this.updateToken();
    return this.http.get<Shot[]>
    (
      `${environment.apiUrl}${environment.shotsList}`,
      { headers: this.headers }
    )
    .pipe(
      map(array => array.sort((a, b) => b.time.localeCompare(a.time)))
    )
    ;
  }

  public newShot(dot: Dot): Observable<Shot> {
    this.updateToken();
    return this.http.post<Shot>(
      `${environment.apiUrl}${environment.shotsNew}`,
      dot, { headers: this.headers }
    );
  }

  public clearShots(): Observable<string> {
    this.updateToken();
    return this.http.post<string>(
      `${environment.apiUrl}${environment.shotsClear}`,
      null, { headers: this.headers }
    );
  }
}
