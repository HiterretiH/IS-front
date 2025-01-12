import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AddressJson } from './address.service';
import { CoordinatesJson } from './coordinates.service';
import { AuthService } from './auth.service';
import { UserJson } from "../components/organization/organization.component";

export interface OrganizationJson {
    id: number;
    name: string;
    owner: UserJson;
    officialAddress: AddressJson;
    postalAddress?: AddressJson | null;
    coordinates: CoordinatesJson;
    type: string;
    employeesCount: number;
    rating: number;
    annualTurnover?: number;
    fullName?: string;
}

@Injectable({
    providedIn: 'root',
})
export class OrganizationService2 {
    private apiUrl = `${environment.apiUrl}/organizations`;

    constructor(private http: HttpClient, private authService: AuthService) {}

    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            Authorization: `Bearer ${this.authService.token}`,
            'Content-Type': 'application/json',
        });
    }

    getOrganizations(): Observable<OrganizationJson[]> {
        return this.http.get<OrganizationJson[]>(this.apiUrl, {
            headers: this.getHeaders(),
        });
    }

    createOrganization(organization: OrganizationJson): Observable<OrganizationJson> {
        return this.http.post<OrganizationJson>(this.apiUrl, organization, {
            headers: this.getHeaders(),
        });
    }

    deleteOrganization(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, {
            headers: this.getHeaders(),
        });
    }
}
