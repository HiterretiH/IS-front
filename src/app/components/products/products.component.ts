import {Component, OnDestroy, OnInit} from '@angular/core';
import { ProductService } from '../../services/product.service';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import { ProductCreateComponent } from '../create/product-create/product-create.component';

@Component({
    selector: 'app-product-list',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css'],
    standalone: true,
    imports: [
        HeaderComponent,
        CommonModule,
        FormsModule,
        ProductCreateComponent
    ]
})
export class ProductsComponent implements OnInit, OnDestroy {
    products: any[] = [];
    totalProducts: number = 0;
    pageSize: number = 10;
    pageIndex: number = 0;
    totalPages: number = 1;
    pollingInterval: any;

    constructor(private productService: ProductService) {}

    ngOnInit(): void {
        this.loadProducts();
        this.startPolling();
    }

    ngOnDestroy(): void {
        this.stopPolling();
    }

    loadProducts(): void {
        this.productService.getProducts(this.pageIndex, this.pageSize).subscribe(
            (products: {data: string[], total: number}) => {
                this.totalProducts = products.total;
                this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
                this.products = products.data.map(productString => JSON.parse(productString));
            },
            (error) => {
                console.error('Error loading products:', error);
            }
        );
    }

    nextPage(): void {
        if (this.pageIndex < this.totalPages - 1) {
            this.pageIndex++;
            this.loadProducts();
        }
    }

    prevPage(): void {
        if (this.pageIndex > 0) {
            this.pageIndex--;
            this.loadProducts();
        }
    }

    startPolling(): void {
        this.pollingInterval = setInterval(() => {
            this.loadProducts();
        }, 10000);
    }

    stopPolling(): void {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
    }
}
