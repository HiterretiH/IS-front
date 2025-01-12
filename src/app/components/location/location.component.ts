import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LocationService, LocationJson } from '../../services/location.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from '../header/header.component';
import { NavComponent } from '../nav/nav.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-create-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.css'],
    imports: [ReactiveFormsModule, ToastModule, HeaderComponent, NavComponent, CommonModule],
    providers: [MessageService],
    standalone: true,
})
export class CreateLocationComponent {
    locationForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private locationService: LocationService,
        private messageService: MessageService
    ) {
        this.locationForm = this.fb.group({
            x: [null, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
            y: [null, [Validators.required, Validators.pattern(/^-?\d+$/)]],
            z: [null, [Validators.pattern(/^-?\d+$/)]],
        });
    }

    onSubmit(): void {
        if (this.locationForm.valid) {
            const location: LocationJson = this.locationForm.value;
            this.locationService.createLocation(location).subscribe(
                (data) => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Location created!' });
                    this.locationForm.reset();
                },
                (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create location.' });
                }
            );
        }
    }
}