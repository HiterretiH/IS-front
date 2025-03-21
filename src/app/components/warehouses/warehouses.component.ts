import {Component, OnDestroy, OnInit} from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {WarehouseService} from "../../services/warehouse.service";
import { WarehouseCreateComponent } from '../create/warehouse-create/warehouse-create.component';

@Component({
    selector: 'app-warehouses',
    templateUrl: './warehouses.component.html',
    styleUrls: ['./warehouses.component.css'],
    standalone: true,
    imports: [
        HeaderComponent,
        CommonModule,
        FormsModule,
        WarehouseCreateComponent
    ]
})
export class WarehousesComponent implements OnInit, OnDestroy {
    warehouses: any[] = [];
    totalWarehouses: number = 0;
    pageSize: number = 10;
    pageIndex: number = 0;
    totalPages: number = 1;
    pollingInterval: any;

    constructor(private warehouseService: WarehouseService) {}

    ngOnInit(): void {
        this.loadWarehouses();
        this.startPolling();
    }

    ngOnDestroy(): void {
        this.stopPolling();
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

    startPolling(): void {
        this.pollingInterval = setInterval(() => {
            this.loadWarehouses();
        }, 10000);
    }

    stopPolling(): void {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
    }
}
