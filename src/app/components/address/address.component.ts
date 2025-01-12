import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AddressService, AddressJson } from '../../services/address.service';
import { LocationService, LocationJson } from '../../services/location.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from '../header/header.component';
import { NavComponent } from '../nav/nav.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-create-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.css'],
    imports: [ReactiveFormsModule, ToastModule, HeaderComponent, NavComponent, CommonModule],
    providers: [MessageService],
    standalone: true,
})
export class CreateAddressComponent implements OnInit {
    addressForm: FormGroup;
    locations: LocationJson[] = [];

    constructor(
        private fb: FormBuilder,
        private addressService: AddressService,
        private locationService: LocationService,
        private messageService: MessageService
    ) {
        this.addressForm = this.fb.group({
            street: [null, [Validators.required]],
            town: [null, [Validators.required]], // ID выбранного Location
        });
    }

    ngOnInit(): void {
        this.loadLocations();
    }

    loadLocations(): void {
        this.locationService.getLocations().subscribe(
            (data) => {
                this.locations = data;
            },
            (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load locations.' });
            }
        );
    }

    onSubmit(): void {
        if (this.addressForm.valid) {
            const address: AddressJson = {
                ...this.addressForm.value,
                town: { id: this.addressForm.value.town } as LocationJson, // Преобразование ID в объект LocationJson
            };
            this.addressService.createAddress(address).subscribe(
                (data) => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Address created!' });
                    this.addressForm.reset();
                },
                (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create address.' });
                }
            );
        }
    }

    trackByLocation(index: number, location: LocationJson): number {
        return location.id; // Оптимизация для *ngFor
    }
}
