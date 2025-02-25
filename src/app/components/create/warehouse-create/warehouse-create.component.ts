import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { WarehouseService } from '../../../services/warehouse.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { WarehouseJson, UserJson } from '../../../json';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-warehouse-create',
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
  templateUrl: './warehouse-create.component.html',
  styleUrls: ['./warehouse-create.component.css'],
  providers: [MessageService]
})
export class WarehouseCreateComponent implements OnInit {
  warehouseForm: FormGroup;
  warehouseIdInput: number | null = null;  // Store the manually entered warehouse ID
  selectedWarehouseId: number | null = null;  // Track the loaded warehouse ID
  user: UserJson = { id: 0, username: '' };

  constructor(
      private fb: FormBuilder,
      private warehouseService: WarehouseService,
      private authService: AuthService,
      private messageService: MessageService
  ) {
    this.warehouseForm = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(150)]],
      address: [null, [Validators.required]]
    });

    this.user.username = this.authService.username;
  }

  ngOnInit() {
    // No need to load warehouses initially since it's now a manual input
  }

  delete() {
    if (this.selectedWarehouseId) {
      this.warehouseService.deleteWarehouse(this.selectedWarehouseId).subscribe(
        () => {
          this.messageService.add({ severity: 'info', summary: 'Склад удалён', detail: 'Склад успешно удалён.' });
          this.warehouseForm.reset();
          this.selectedWarehouseId = null;
        },
        () => {
          this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Ошибка удаления склада.' });
        }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Введите корректный ID склада.' });
    }
  }  

  // Handle loading warehouse by manually entered ID
  onWarehouseLoad() {
    if (this.warehouseIdInput) {
      this.warehouseService.getById(this.warehouseIdInput).subscribe(
          (warehouse: WarehouseJson) => {
            this.selectedWarehouseId = warehouse.id;
            this.warehouseForm.patchValue({
              name: warehouse.name,
              address: warehouse.address
            });
            this.messageService.add({ severity: 'info', summary: 'Склад загружен', detail: 'Данные склада загружены.' });
          },
          () => {
            this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось найти склад.' });
          }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Введите корректный ID склада.' });
    }
  }

  onSubmit() {
    if (this.warehouseForm.valid) {
      const warehouseData: WarehouseJson = {
        id: this.selectedWarehouseId || 0,
        name: this.warehouseForm.value.name,
        address: this.warehouseForm.value.address
      };

      if (this.selectedWarehouseId) {
        // Update warehouse
        this.warehouseService.updateWarehouse(warehouseData.id, warehouseData).subscribe(
            () => {
              this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Склад обновлен!' });
              this.warehouseForm.reset();
              this.selectedWarehouseId = null;
            },
            () => {
              this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось обновить склад.' });
            }
        );
      } else {
        // Create new warehouse
        this.warehouseService.createWarehouse(warehouseData).subscribe(
            () => {
              this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Склад создан!' });
              this.warehouseForm.reset();
            },
            () => {
              this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось создать склад.' });
            }
        );
      }
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Пожалуйста, заполните все обязательные поля.' });
    }
  }

  get f() {
    return this.warehouseForm.controls;
  }
}
