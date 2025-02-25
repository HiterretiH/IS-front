import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SortingStationService } from '../../../services/sorting-station.service';
import { WarehouseService } from '../../../services/warehouse.service';
import { LocationService } from '../../../services/location.service';
import { WarehouseJson, LocationJson, SortingStationJson } from '../../../json';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-sorting-station-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    ToastModule,
    CommonModule,
    DropdownModule
  ],
  templateUrl: './sorting-station-create.component.html',
  styleUrls: ['./sorting-station-create.component.css'],
  providers: [MessageService]
})
export class SortingStationCreateComponent {
  sortingStationForm: FormGroup;
  warehouse: WarehouseJson | null = null;
  location: LocationJson | null = null;

  constructor(
    private fb: FormBuilder,
    private sortingStationService: SortingStationService,
    private warehouseService: WarehouseService,
    private locationService: LocationService,
    private messageService: MessageService
  ) {
    this.sortingStationForm = this.fb.group({
      warehouseId: [null, Validators.required],
      locationId: [null, Validators.required],
      capacity: [null, [Validators.required, Validators.min(1)]],
      sortTimeSeconds: [null, [Validators.required, Validators.min(1)]]
    });
  }

  checkWarehouse() {
    const warehouseId = this.sortingStationForm.get('warehouseId')?.value;
    if (warehouseId) {
      this.warehouseService.getById(warehouseId).subscribe(
        (warehouse) => {
          this.warehouse = warehouse;
        },
        () => {
          this.warehouse = null;
        }
      );
    }
  }

  checkLocation() {
    const locationId = this.sortingStationForm.get('locationId')?.value;
    if (locationId) {
      this.locationService.getById(locationId).subscribe(
        (location) => {
          this.location = location;
        },
        () => {
          this.location = null;
        }
      );
    }
  }

  onSubmit() {
    if (this.sortingStationForm.valid) {
      if (!this.warehouse || !this.location) {
        this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Пожалуйста, выберите действительный склад и местоположение.' });
        return;
      }

      const sortingStationData: SortingStationJson = {
        id: 0,
        warehouse: this.warehouse,
        location: this.location,
        capacity: this.sortingStationForm.value.capacity,
        sortTimeSeconds: this.sortingStationForm.value.sortTimeSeconds
      };

      this.sortingStationService.create(sortingStationData).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Сортировочная станция создана!' });
          this.sortingStationForm.reset();
        },
        () => {
          this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось создать сортировочную станцию.' });
        }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Пожалуйста, заполните все обязательные поля.' });
    }
  }

  get f() {
    return this.sortingStationForm.controls;
  }
}
