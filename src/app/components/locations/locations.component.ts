import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {SortingStationService} from "../../services/sorting-station.service";
import {LocationService} from "../../services/location.service";
import { LocationCreateComponent } from '../create/location-create/location-create.component';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-locations',
    templateUrl: './locations.component.html',
    styleUrls: ['./locations.component.css'],
    standalone: true,
    imports: [
        HeaderComponent,
        CommonModule,
        FormsModule,
        LocationCreateComponent
    ]
})
export class LocationsComponent implements OnInit {
    locations: any[] = [];
    totalLocations: number = 0;
    pageSize: number = 10;
    pageIndex: number = 0;
    totalPages: number = 1;

    constructor(
        private locationService: LocationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadAll();
    }

    loadAll(): void {
        this.locationService.getAll(this.pageIndex, this.pageSize).subscribe(
            (locations: {data: string[], total: number}) => {
                this.totalLocations = locations.total;
                this.totalPages = Math.ceil(this.totalLocations / this.pageSize);
                this.locations = locations.data.map(locationString => JSON.parse(locationString));
            },
            (error) => {
                console.error('Error loading products:', error);
            }
        );
    }

    goToLocation(id: number): void {
        this.router.navigate([`/location/${id}`]);
      }

    nextPage(): void {
        if (this.pageIndex < this.totalPages - 1) {
            this.pageIndex++;
            this.loadAll();
        }
    }

    prevPage(): void {
        if (this.pageIndex > 0) {
            this.pageIndex--;
            this.loadAll();
        }
    }
}
