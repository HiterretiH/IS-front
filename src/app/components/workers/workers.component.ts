import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {SortingStationService} from "../../services/sorting-station.service";
import {WorkerService} from "../../services/worker.service";

@Component({
    selector: 'app-workers',
    templateUrl: './workers.component.html',
    styleUrls: ['./workers.component.css'],
    standalone: true,
    imports: [
        HeaderComponent,
        CommonModule,
        FormsModule,
    ]
})
export class WorkersComponent implements OnInit {
    workers: any[] = [];
    totalWorkers: number = 0;
    pageSize: number = 10;
    pageIndex: number = 0;
    totalPages: number = 1;

    constructor(private workerService: WorkerService) {}

    ngOnInit(): void {
        this.loadWorkers();
    }

    loadWorkers(): void {
        this.workerService.getAll(this.pageIndex, this.pageSize).subscribe(
            (workers: {data: string[], total: number}) => {
                this.totalWorkers = workers.total;
                this.totalPages = Math.ceil(this.totalWorkers / this.pageSize);
                this.workers = workers.data.map(workerString => JSON.parse(workerString));
            },
            (error) => {
                console.error('Error loading products:', error);
            }
        );
    }

    nextPage(): void {
        if (this.pageIndex < this.totalPages - 1) {
            this.pageIndex++;
            this.loadWorkers();
        }
    }

    prevPage(): void {
        if (this.pageIndex > 0) {
            this.pageIndex--;
            this.loadWorkers();
        }
    }
}
