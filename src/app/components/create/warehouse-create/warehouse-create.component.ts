import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WarehouseService } from '../../../services/warehouse.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { UserJson, WarehouseJson } from '../../../json';
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
    InputNumberModule
  ],
  templateUrl: './warehouse-create.component.html',
  styleUrls: ['./warehouse-create.component.css'],
  providers: [MessageService]
})
export class WarehouseCreateComponent {
  warehouseForm: FormGroup;
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

  onSubmit() {
    if (this.warehouseForm.valid) {
      const warehouseData: WarehouseJson = {
        id: 0,
        name: this.warehouseForm.value.name,
        address: this.warehouseForm.value.address
      };

      this.warehouseService.createWarehouse(warehouseData).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Склад создан!' });
          this.warehouseForm.reset();
        },
        () => {
          this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось создать склад.' });
        }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Пожалуйста, заполните все обязательные поля.' });
    }
  }

  get f() {
    return this.warehouseForm.controls;
  }
}
