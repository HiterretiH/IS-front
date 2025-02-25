import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { QueueService } from '../../../services/queue.service';
import { SortingStationService } from '../../../services/sorting-station.service';
import { QueueJson, SortingStationJson } from '../../../json';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-queue-create',
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
  templateUrl: './queue-create.component.html',
  styleUrls: ['./queue-create.component.css'],
  providers: [MessageService]
})
export class QueueCreateComponent {
  queueForm: FormGroup;
  sortingStation: SortingStationJson | null = null;

  constructor(
    private fb: FormBuilder,
    private queueService: QueueService,
    private sortingStationService: SortingStationService,
    private messageService: MessageService
  ) {
    this.queueForm = this.fb.group({
      sortingStationId: [null, Validators.required],
      capacity: [null, [Validators.required, Validators.min(1)]]
    });
  }

  checkSortingStation() {
    const sortingStationId = this.queueForm.get('sortingStationId')?.value;
    if (sortingStationId) {
      this.sortingStationService.getById(sortingStationId).subscribe(
        (sortingStation) => {
          this.sortingStation = sortingStation;
        },
        () => {
          this.sortingStation = null;
        }
      );
    }
  }

  onSubmit() {
    if (this.queueForm.valid) {
      if (!this.sortingStation) {
        this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Пожалуйста, выберите действительную сортировочную станцию.' });
        return;
      }

      const queueData: QueueJson = {
        id: 0,
        sortingStation: this.sortingStation,
        capacity: this.queueForm.value.capacity
      };

      this.queueService.createQueue(queueData).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Очередь создана!' });
          this.queueForm.reset();
        },
        () => {
          this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось создать очередь.' });
        }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Пожалуйста, заполните все обязательные поля.' });
    }
  }

  get f() {
    return this.queueForm.controls;
  }
}
