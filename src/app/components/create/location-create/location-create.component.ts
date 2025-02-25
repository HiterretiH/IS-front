import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { LocationService } from '../../../services/location.service';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { LocationJson, UserJson } from '../../../json';

@Component({
  selector: 'app-location-create',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    ReactiveFormsModule,
    InputTextModule,
    ToastModule,
    CommonModule,
    InputNumberModule
  ],
  templateUrl: './location-create.component.html',
  styleUrls: ['./location-create.component.css'],
  providers: [MessageService]
})
export class LocationCreateComponent {
  locationForm: FormGroup;
  user: UserJson = { id: 0, username: '' };

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.locationForm = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(150)]],
      description: [null],
      locationRow: [null, [Validators.required]]
    });

    this.user.username = this.authService.username;
  }

  onSubmit() {
    if (this.locationForm.valid) {
      const locationData: LocationJson = {
        id: 0,
        name: this.locationForm.value.name,
        description: this.locationForm.value.description,
        locationRow: this.locationForm.value.locationRow
      };

      this.locationService.createLocation(locationData).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Локация создана!' });
          this.locationForm.reset();
        },
        () => {
          this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось создать локацию.' });
        }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Пожалуйста, заполните все обязательные поля.' });
    }
  }

  get f() {
    return this.locationForm.controls;
  }
}
