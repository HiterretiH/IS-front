import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrganizationJson {
  id: number;
  name: string;
  owner: {
    id: number;
    username: string;
  };
  coordinates: number;
  creationDate: Date;
  officialAddress: number;
  postalAddress?: number;
  annualTurnover?: number;
  employeesCount: number;
  rating: number;
  fullName?: string;
  type: string;  // Тип организации
}



@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private apiUrl = environment.apiUrl + '/organizations';

  constructor(private http: HttpClient) {}

  getOrganizations(): Observable<OrganizationJson[]> {
    return this.http.get<OrganizationJson[]>(this.apiUrl);
  }

  createOrganization(organization: OrganizationJson): Observable<OrganizationJson> {
    return this.http.post<OrganizationJson>(this.apiUrl, organization);
  }

  deleteOrganization(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}


