// address.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LocationJson } from './location.service';

export interface AddressJson {
    id: number;
    street: string;
    town: LocationJson;
}

@Injectable({
    providedIn: 'root',
})
export class AddressService {
    private apiUrl = `${environment.apiUrl}/addresses`;

    constructor(private http: HttpClient) {}

    getAddresses(): Observable<AddressJson[]> {
        return this.http.get<AddressJson[]>(this.apiUrl);
    }

    createAddress(address: AddressJson): Observable<AddressJson> {
        return this.http.post<AddressJson>(this.apiUrl, address);
    }
}
