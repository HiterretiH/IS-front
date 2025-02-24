import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {WarehouseService} from "../../services/warehouse.service";

@Component({
    selector: 'app-warehouses',
    templateUrl: './warehouses.component.html',
    styleUrls: ['./warehouses.component.css'],
    standalone: true,
    imports: [
        HeaderComponent,
        CommonModule,
        FormsModule,
    ]
})
export class WarehousesComponent implements OnInit {
    warehouses: any[] = [];
    totalWarehouses: number = 0;
    pageSize: number = 10;
    pageIndex: number = 0;
    totalPages: number = 1;

    constructor(private warehouseService: WarehouseService) {}

    ngOnInit(): void {
        this.loadWarehouses();
    }

    loadWarehouses(): void {
        this.warehouseService.getAll(this.pageIndex, this.pageSize).subscribe(
            (workers: {data: string[], total: number}) => {
                this.totalWarehouses = workers.total;
                this.totalPages = Math.ceil(this.totalWarehouses / this.pageSize);
                this.warehouses = workers.data.map(workerString => JSON.parse(workerString));
            },
            (error) => {
                console.error('Error loading products:', error);
            }
        );
    }

    nextPage(): void {
        if (this.pageIndex < this.totalPages - 1) {
            this.pageIndex++;
            this.loadWarehouses();
        }
    }

    prevPage(): void {
        if (this.pageIndex > 0) {
            this.pageIndex--;
            this.loadWarehouses();
        }
    }
}
