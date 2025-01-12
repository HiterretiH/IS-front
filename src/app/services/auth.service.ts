import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { of, filter, map, pipe } from 'rxjs';

interface Token {
  token: string,
  expirationDate: number,
  role: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public headers: HttpHeaders = new HttpHeaders;

  constructor(private http: HttpClient) { }

  auth(username: string, token: string, role: string): void {
    this.username = username;
    this.token = token;
    this.role = role;
  }

  public updateToken(): void {
    this.headers = new HttpHeaders({
      Authorization: `${this.token}`
    });
  }

  isAdmin(): boolean {
    return this.role == "ADMIN";
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  logOut(): void {
    this.username = "";
    this.token = "";
    this.role = "";
  }

  login (username: string, password: string): Observable<string> {
    this.logOut();
    return this.http.post<Token>(
      `${environment.apiUrl}${environment.loginPath}`,
      { username, password }
    ).pipe(
      map(
        (result) => {
          this.auth(username, result.token, result.role);
          return result.token;
        }
      )
    );
  }

  register (username: string, password: string): Observable<string> {
    this.logOut();
    return this.http.post<Token>(
      `${environment.apiUrl}${environment.registerPath}`,
      { username, password }
    ).pipe(
      map(
        (result) => {
          this.auth(username, result.token, result.role);
          return result.token;
        }
      )
    );
  }

  set token(value: string) {
    localStorage.setItem("api-token", value);
  }

  get token(): string {
    return localStorage.getItem("api-token") || "";
  }

  set username(value: string) {
    localStorage.setItem("username", value);
  }

  get username(): string {
    return localStorage.getItem("username") || "";
  }
  
  set role(value: string) {
    localStorage.setItem("role", value);
  }

  get role(): string {
    return localStorage.getItem("role") || "";
  }
}
