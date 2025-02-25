import {Component, OnDestroy, OnInit} from '@angular/core';
import { ProductService } from '../../services/product.service';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {SortingStationService} from "../../services/sorting-station.service";
import {LocationService} from "../../services/location.service";
import {PartnerService} from "../../services/partner.service";
import { PartnerCreateComponent } from '../create/partner-create/partner-create.component';

@Component({
    selector: 'app-partners',
    templateUrl: './partners.component.html',
    styleUrls: ['./partners.component.css'],
    standalone: true,
    imports: [
        HeaderComponent,
        CommonModule,
        FormsModule,
        PartnerCreateComponent
    ]
})
export class PartnersComponent implements OnInit, OnDestroy {
    partners: any[] = [];
    totalPartners: number = 0;
    pageSize: number = 10;
    pageIndex: number = 0;
    totalPages: number = 1;
    pollingInterval: any;

    constructor(private partnerService: PartnerService) {}

    ngOnInit(): void {
        this.loadAll();
        this.startPolling();
    }

    ngOnDestroy(): void {
        this.stopPolling();
    }

    loadAll(): void {
        this.partnerService.getAll(this.pageIndex, this.pageSize).subscribe(
            (partners: {data: string[], total: number}) => {
                this.totalPartners = partners.total;
                this.totalPages = Math.ceil(this.totalPartners / this.pageSize);
                this.partners = partners.data.map(partnerString => JSON.parse(partnerString));
            },
            (error) => {
                console.error('Error loading products:', error);
            }
        );
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

    startPolling(): void {
        this.pollingInterval = setInterval(() => {
            this.loadAll();
        }, 10000);
    }

    stopPolling(): void {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
    }
}
