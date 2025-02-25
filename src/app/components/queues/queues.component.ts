import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {QueueService} from "../../services/queue.service";
import { QueueCreateComponent } from '../create/queue-create/queue-create.component';

@Component({
    selector: 'app-queues',
    templateUrl: './queues.component.html',
    styleUrls: ['./queues.component.css'],
    standalone: true,
    imports: [
        HeaderComponent,
        CommonModule,
        FormsModule,
        QueueCreateComponent
    ]
})
export class QueuesComponent implements OnInit {
    queues: any[] = [];
    totalProducts: number = 0;
    pageSize: number = 10;
    pageIndex: number = 0;
    totalPages: number = 1;

    constructor(private queueService: QueueService) {}

    ngOnInit(): void {
        this.loadQueues();
    }

    loadQueues(): void {
        this.queueService.getAll(this.pageIndex, this.pageSize).subscribe(
            (queues: {data: string[], total: number}) => {
                this.totalProducts = queues.total;
                this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
                this.queues = queues.data.map(queueString => JSON.parse(queueString));
            },
            (error) => {
                console.error('Error loading products:', error);
            }
        );
    }

    nextPage(): void {
        if (this.pageIndex < this.totalPages - 1) {
            this.pageIndex++;
            this.loadQueues();
        }
    }

    prevPage(): void {
        if (this.pageIndex > 0) {
            this.pageIndex--;
            this.loadQueues();
        }
    }
}
