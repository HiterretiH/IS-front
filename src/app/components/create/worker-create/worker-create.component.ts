import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { WorkerService } from '../../../services/worker.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { UserJson, WorkerJson, WarehouseJson, Status } from '../../../json';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { WarehouseService } from '../../../services/warehouse.service';

@Component({
  selector: 'app-worker-create',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    ReactiveFormsModule,
    InputTextModule,
    ToastModule,
    DropdownModule,
    CommonModule,
    CalendarModule,
    FormsModule
  ],
  templateUrl: './worker-create.component.html',
  styleUrls: ['./worker-create.component.css'],
  providers: [MessageService]
})
export class WorkerCreateComponent {
  workerForm: FormGroup;
  user: UserJson = { id: 0, username: '' };
  warehouse: WarehouseJson | null = null;
  statuses: Status[] = [Status.HIRED, Status.FIRED, Status.PENDING, Status.REJECTED];
  workerIdInput: string = '';

  constructor(
      private fb: FormBuilder,
      private workerService: WorkerService,
      private warehouseService: WarehouseService,
      private authService: AuthService,
      private messageService: MessageService
  ) {
    this.workerForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.maxLength(100)]],
      lastName: [null, [Validators.required, Validators.maxLength(100)]],
      middleName: [null, [Validators.required, Validators.maxLength(100)]],
      birthDate: [null, Validators.required],
      hireDate: [null, Validators.required],
      status: [null, Validators.required],
      warehouseId: [null, Validators.required]
    });

    this.user.username = this.authService.username;
  }

  checkWarehouse() {
    const warehouseId = this.workerForm.get('warehouseId')?.value;
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

  onWorkerLoad() {
    this.workerService.getById(parseInt(this.workerIdInput)).subscribe(worker => {
      this.workerForm.patchValue({
        firstName: worker.firstName,
        lastName: worker.lastName,
        middleName: worker.middleName,
        birthDate: new Date(worker.birthDate),
        hireDate: new Date(worker.hireDate),
        status: worker.status,
        warehouseId: worker.warehouse.id
      });
    });
  }

  onSubmit() {
    if (this.workerForm.valid) {
      if (!this.warehouse) {
        this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Пожалуйста, выберите действительный склад.' });
        return;
      }

      const workerData: WorkerJson = {
        id: 0,
        firstName: this.workerForm.value.firstName,
        lastName: this.workerForm.value.lastName,
        middleName: this.workerForm.value.middleName,
        birthDate: this.workerForm.value.birthDate,
        hireDate: this.workerForm.value.hireDate,
        status: this.workerForm.value.status,
        warehouse: this.warehouse
      };

      this.workerService.createWorker(workerData).subscribe(
          () => {
            this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Рабочий создан!' });
            this.workerForm.reset();
          },
          () => {
            this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось создать рабочего.' });
          }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Пожалуйста, заполните все обязательные поля.' });
    }
  }

  get f() {
    return this.workerForm.controls;
  }
}
