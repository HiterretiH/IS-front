import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SortingStationService } from '../../../services/sorting-station.service';
import { WarehouseService } from '../../../services/warehouse.service';
import { LocationService } from '../../../services/location.service';
import { WarehouseJson, LocationJson, SortingStationJson } from '../../../json';
import {ToastModule} from "primeng/toast";
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {NgIf} from "@angular/common";
import {ChipsModule} from "primeng/chips";

@Component({
  selector: 'app-sorting-station-create',
  templateUrl: './sorting-station-create.component.html',
  styleUrls: ['./sorting-station-create.component.css'],
  standalone: true,
  imports: [
    ToastModule,
    CardModule,
    FormsModule,
    ButtonModule,
    ReactiveFormsModule,
    NgIf,
    ChipsModule
  ],
  providers: [MessageService]
})
export class SortingStationCreateComponent implements OnInit {
  sortingStationForm: FormGroup;
  warehouse: WarehouseJson | null = null;
  location: LocationJson | null = null;
  stationIdInput: number | null = null;
  selectedStationId: number | null = null; // Track loaded sorting station

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

  ngOnInit() {}

  // Load sorting station by ID
  onStationLoad() {
    if (this.stationIdInput) {
      this.sortingStationService.getById(this.stationIdInput).subscribe(
          (station: SortingStationJson) => {
            this.selectedStationId = station.id;
            this.sortingStationForm.patchValue({
              warehouseId: station.warehouse.id,
              locationId: station.location.id,
              capacity: station.capacity,
              sortTimeSeconds: station.sortTimeSeconds
            });
            this.checkWarehouse();
            this.checkLocation();
            this.messageService.add({ severity: 'info', summary: 'Станция загружена', detail: 'Данные сортировочной станции загружены.' });
          },
          () => {
            this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось найти сортировочную станцию.' });
          }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Введите корректный ID сортировочной станции.' });
    }
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
        id: this.selectedStationId || 0,
        warehouse: this.warehouse,
        location: this.location,
        capacity: this.sortingStationForm.value.capacity,
        sortTimeSeconds: this.sortingStationForm.value.sortTimeSeconds
      };

      if (this.selectedStationId) {
        // Update existing sorting station
        this.sortingStationService.update(this.selectedStationId, sortingStationData).subscribe(
            () => {
              this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Сортировочная станция обновлена!' });
              this.sortingStationForm.reset();
              this.selectedStationId = null;
            },
            () => {
              this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось обновить сортировочную станцию.' });
            }
        );
      } else {
        // Create new sorting station
        this.sortingStationService.create(sortingStationData).subscribe(
            () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Успех',
                detail: 'Сортировочная станция создана!'
              });
              this.sortingStationForm.reset();
            },
            () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Ошибка',
                detail: 'Не удалось создать сортировочную станцию'
              });
            }
        );
      }
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Пожалуйста, заполните все обязательные поля.' });
    }
  }

  get f() {
    return this.sortingStationForm.controls;
  }
}
