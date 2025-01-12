import { Component, OnInit } from '@angular/core';
import { OrganizationService2 } from '../../services/organization.service2';
import { HeaderComponent } from "../header/header.component";
import { DatePipe } from "@angular/common";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-organization-list',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: true,
    imports: [
        HeaderComponent,
        DatePipe,
        CommonModule,
    ]
})
export class HomeComponent implements OnInit {
    organizations: any[] = [];
    totalOrganizations: number = 0;
    pageSize: number = 10;
    pageIndex: number = 0;
    totalPages: number = 0; // Добавлено

    sortColumn: string = '';
    sortDirection: boolean = true;

    constructor(private organizationService2: OrganizationService2) {}

    ngOnInit(): void {
        this.loadOrganizations();
    }

    loadOrganizations(): void {
        this.organizationService2.getOrganizations().subscribe(
            (organizations: any[]) => {
                const adaptedOrganizations = organizations.map(org => ({
                    id: org.id,
                    name: org.name,
                    owner: org.owner?.username || 'Unknown',
                    coordinates: org.coordinates || { x: 0, y: 0 },
                    creationDate: org.creationDate ? new Date(org.creationDate) : null,
                    officialAddress: org.officialAddress || { street: '', town: { x: 0, y: 0, z: 0 } },
                    annualTurnover: org.annualTurnover || 0,
                    employeesCount: org.employeesCount || 0,
                    rating: org.rating || 0,
                    fullName: org.fullName || '',
                    type: org.type || '',
                    postalAddress: org.postalAddress || { street: '', town: { x: 0, y: 0, z: 0 } }
                }));

                this.totalOrganizations = adaptedOrganizations.length;
                this.totalPages = Math.ceil(this.totalOrganizations / this.pageSize); // Вычисление totalPages
                this.organizations = adaptedOrganizations.slice(
                    this.pageIndex * this.pageSize,
                    this.pageIndex * this.pageSize + this.pageSize
                );
            },
            (error) => {
                console.error('Error loading organizations:', error);
            }
        );
    }

    sort(column: string): void {
        if (this.sortColumn === column) {
            this.sortDirection = !this.sortDirection;
        } else {
            this.sortColumn = column;
            this.sortDirection = true;
        }

        this.organizations.sort((a, b) => {
            const aValue = a[column];
            const bValue = b[column];

            if (aValue < bValue) return this.sortDirection ? -1 : 1;
            if (aValue > bValue) return this.sortDirection ? 1 : -1;
            return 0;
        });
    }

    deleteOrganization(id: number): void {
        this.organizationService2.deleteOrganization(id).subscribe(() => {
            this.organizations = this.organizations.filter(org => org.id !== id);
            this.loadOrganizations();
        });
    }

    nextPage(): void {
        if (this.pageIndex < this.totalPages - 1) {
            this.pageIndex++;
            this.loadOrganizations();
        }
    }

    prevPage(): void {
        if (this.pageIndex > 0) {
            this.pageIndex--;
            this.loadOrganizations();
        }
    }
}
