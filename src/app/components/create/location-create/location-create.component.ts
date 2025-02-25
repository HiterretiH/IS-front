import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
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
    InputNumberModule,
    FormsModule
  ],
  templateUrl: './location-create.component.html',
  styleUrls: ['./location-create.component.css'],
  providers: [MessageService]
})
export class LocationCreateComponent implements OnInit {
  locationForm: FormGroup;
  user: UserJson = { id: 0, username: '' };
  locationIdInput: number | null = null;
  selectedLocationId: number | null = null;

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

  ngOnInit() {
  }

  onLocationLoad() {
    if (this.locationIdInput) {
      this.locationService.getById(this.locationIdInput).subscribe(
          (location: LocationJson) => {
            this.selectedLocationId = location.id;
            this.locationForm.patchValue({
              name: location.name,
              description: location.description,
              locationRow: location.locationRow
            });
            this.messageService.add({ severity: 'info', summary: 'Локация загружена', detail: 'Данные локации загружены.' });
          },
          () => {
            this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось найти локацию.' });
          }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Введите корректный ID локации.' });
    }
  }

  delete() {
    if (this.selectedLocationId) {
      this.locationService.deleteLocation(this.selectedLocationId).subscribe(
        (res: any) => {
          this.messageService.add({ severity: 'info', summary: 'Локация удалена', detail: 'Локация успешно удалена.' });
        },
        () => {
          this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Ошибка удаления локации.' });
        }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Введите корректный ID локации.' });
    }
  }

  onSubmit() {
    if (this.locationForm.valid) {
      const locationData: LocationJson = {
        id: this.selectedLocationId || 0,
        name: this.locationForm.value.name,
        description: this.locationForm.value.description,
        locationRow: this.locationForm.value.locationRow
      };

      if (this.selectedLocationId) {
        this.locationService.updateLocation(locationData.id, locationData).subscribe(
            () => {
              this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Локация обновлена!' });
              this.locationForm.reset();
              this.selectedLocationId = null;
            },
            () => {
              this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось обновить локацию.' });
            }
        );
      } else {
        this.locationService.createLocation(locationData).subscribe(
            () => {
              this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Локация создана!' });
              this.locationForm.reset();
            },
            () => {
              this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось создать локацию.' });
            }
        );
      }
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Пожалуйста, заполните все обязательные поля.' });
    }
  }

  get f() {
    return this.locationForm.controls;
  }
}
