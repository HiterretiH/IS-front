import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AddressService, AddressJson } from '../../services/address.service';
import {OrganizationJson, OrganizationService2} from '../../services/organization.service2';
import { MessageService } from 'primeng/api';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import {CoordinatesJson, CoordinatesService} from "../../services/coordinates.service";

export interface UserJson {
    username: string;
}

@Component({
    selector: 'app-create-organization',
    templateUrl: './organization.component.html',
    styleUrls: ['./organization.component.css'],
    providers: [MessageService],
    standalone: true,
    imports: [ReactiveFormsModule, HeaderComponent, CommonModule],
})
export class CreateOrganizationComponent implements OnInit {
    organizationForm: FormGroup;
    addresses: AddressJson[] = [];
    coordinatesList: CoordinatesJson[] = [];
    organizationTypes: string[] = [
        'COMMERCIAL',
        'PRIVATE_LIMITED_COMPANY',
        'OPEN_JOINT_STOCK_COMPANY'
    ];

    constructor(
        private fb: FormBuilder,
        private addressService: AddressService,
        private coordinatesService: CoordinatesService,
        private organizationService: OrganizationService2,
        private messageService: MessageService
    ) {
        this.organizationForm = this.fb.group({
            name: [null, [Validators.required]],
            officialAddress: [null, [Validators.required]],
            postalAddress: [null],
            coordinates: [null, [Validators.required]],
            type: [null, [Validators.required]],
            employeesCount: [0, [Validators.min(0)]],
            rating: [0, [Validators.min(0)]],
            annualTurnover: [null],
            fullName: [null, [Validators.maxLength(777)]],
        });
    }

    ngOnInit(): void {
        this.loadAddresses();
        this.loadCoordinates();
    }

    loadAddresses(): void {
        this.addressService.getAddresses().subscribe(
            (data) => {
                this.addresses = data;
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load addresses.',
                });
            }
        );
    }

    loadCoordinates(): void {
        this.coordinatesService.getCoordinates().subscribe(
            (data) => {
                this.coordinatesList = data;
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load coordinates.',
                });
            }
        );
    }

    onSubmit(): void {
        if (this.organizationForm.valid) {
            const formValue = this.organizationForm.value;
            const userId = localStorage.getItem("userId");
            const username = localStorage.getItem("username");
            console.log('Form Value:', formValue);

            const organization: OrganizationJson = {
                ...formValue,
                officialAddress: { id: formValue.officialAddress } as AddressJson,
                postalAddress: formValue.postalAddress ? { id: formValue.postalAddress } as AddressJson : null,
                coordinates: { id: formValue.coordinates } as CoordinatesJson,
                owner: {username: localStorage.getItem("username")} as UserJson,
            };

            console.log('Organization Object:', organization);

            this.organizationService.createOrganization(organization).subscribe(
                () => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Organization created!' });
                    this.organizationForm.reset();
                },
                (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to create organization.',
                    });
                }
            );
        }
    }
}
