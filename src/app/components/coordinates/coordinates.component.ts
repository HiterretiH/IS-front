import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder} from '@angular/forms';
import { CoordinatesService, CoordinatesJson } from '../../services/coordinates.service';
import { MessageService } from 'primeng/api';
import {ToastModule} from "primeng/toast";
import {HeaderComponent} from "../header/header.component";
import {NavComponent} from "../nav/nav.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-create-coordinates',
    templateUrl: './coordinates.component.html',
    styleUrls: ['./coordinates.component.css'],
    imports: [ReactiveFormsModule, ToastModule, HeaderComponent, NavComponent, CommonModule],
    providers: [MessageService],
    standalone: true
})

export class CreateCoordinatesComponent {
    coordinatesForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private coordinatesService: CoordinatesService,
        private messageService: MessageService
    ) {
        this.coordinatesForm = this.fb.group({
            x: [null, [Validators.required, Validators.pattern(/^-?\d+$/)]], // Исправлено на \d
            y: [null, [Validators.required, Validators.max(881), Validators.pattern(/^-?\d+(\.\d+)?$/)]]
        });
    }

    onSubmit(): void {
        if (this.coordinatesForm.valid) {
            const coordinates: CoordinatesJson = this.coordinatesForm.value;
            this.coordinatesService.createCoordinates(coordinates).subscribe(
                (data) => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Coordinates created!' });
                    this.coordinatesForm.reset();
                },
                (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create coordinates.' });
                }
            );
        }
    }
}