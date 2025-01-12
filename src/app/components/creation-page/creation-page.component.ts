import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { OrganizationService } from '../../services/organization.service';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { NavComponent } from "../nav/nav.component";

@Component({
  selector: 'app-creation-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    ToastModule,
    CommonModule,
    HeaderComponent,
    NavComponent
],
  templateUrl: './creation-page.component.html',
  styleUrls: ['./creation-page.component.css'],
  providers: [MessageService],
})
export class CreationPageComponent {
  creationForm: FormGroup;

  positions: { label: string; value: string }[] = [
    { label: 'Manager', value: 'Manager' },
    { label: 'Engineer', value: 'Engineer' },
    { label: 'Technician', value: 'Technician' },
  ];

  constructor(
    private organizationService: OrganizationService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.creationForm = new FormGroup({
      id: new FormControl(null, [Validators.required]),
      name: new FormControl('', [Validators.required, Validators.minLength(1)]),
      owner: new FormControl('', [Validators.required]),
      coordinates: new FormGroup({
        x: new FormControl(null, [Validators.required]),
        y: new FormControl(null, [Validators.required, Validators.max(415)]),
      }),
      creationDate: new FormControl(new Date(), [Validators.required]),
      organization: new FormGroup({
        id: new FormControl(null, [Validators.required]),
        rating: new FormControl(null, [Validators.required, Validators.min(1)]),
      }),
      salary: new FormControl(null, [Validators.required, Validators.min(0.01)]),
      rating: new FormControl(null, [Validators.required, Validators.min(1)]),
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl(null, [Validators.required]),
      position: new FormControl(null, [Validators.required]),
      person: new FormGroup({
        id: new FormControl(null, [Validators.required]),
        height: new FormControl(null, [Validators.required, Validators.min(1)]),
        weight: new FormControl(null, [Validators.required, Validators.min(1)]),
        passportID: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(48)]),
      }),
    });
  }

  onSubmit(): void {
    if (this.creationForm.valid) {
      this.organizationService.createOrganization(this.creationForm.value).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Worker created successfully!',
          });
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create worker. Please try again.',
          });
          console.error(err);
        },
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Data',
        detail: 'Please fill all required fields correctly.',
      });
    }
  }
}
