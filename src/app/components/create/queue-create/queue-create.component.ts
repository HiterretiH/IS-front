import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
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
    DropdownModule,
    FormsModule
  ],
  templateUrl: './queue-create.component.html',
  styleUrls: ['./queue-create.component.css'],
  providers: [MessageService]
})
export class QueueCreateComponent {
  queueForm: FormGroup;
  queueIdInput: string = ''; // Store entered queue ID
  sortingStation: SortingStationJson | null = null; // Store sorting station details
  currentQueue: QueueJson | null = null; // For holding current queue if editing

  constructor(
      private fb: FormBuilder,
      private queueService: QueueService,
      private sortingStationService: SortingStationService,
      private messageService: MessageService
  ) {
    // Initializing the form
    this.queueForm = this.fb.group({
      sortingStationId: [null, Validators.required],
      capacity: [null, [Validators.required, Validators.min(1)]]
    });
  }

  // Check if sorting station exists and update the sortingStation object
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

  // Load the queue based on the entered queue ID
  onQueueLoad() {
    if (this.queueIdInput) {
      this.queueService.getById(parseInt(this.queueIdInput, 10)).subscribe(
          (queue) => {
            this.currentQueue = queue;
            this.queueForm.patchValue({
              sortingStationId: queue.sortingStation.id,
              capacity: queue.capacity
            });
            this.sortingStation = queue.sortingStation;
          },
          () => {
            this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось загрузить очередь.' });
          }
      );
    }
  }

  // Handle the form submission for creating or updating a queue
  onSubmit() {
    if (this.queueForm.valid) {
      if (!this.sortingStation) {
        this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Пожалуйста, выберите действительную сортировочную станцию.' });
        return;
      }

      const queueData: QueueJson = {
        id: this.currentQueue ? this.currentQueue.id : 0, // Use the existing queue ID if editing
        sortingStation: this.sortingStation,
        capacity: this.queueForm.value.capacity
      };

      // Determine if we need to update or create
      const queueRequest$ = this.currentQueue
          ? this.queueService.updateQueue(queueData.id, queueData) // Update if editing
          : this.queueService.createQueue(queueData); // Create if new

      queueRequest$.subscribe(
          () => {
            this.messageService.add({ severity: 'success', summary: 'Успех', detail: this.currentQueue ? 'Очередь обновлена!' : 'Очередь создана!' });
            this.queueForm.reset();
            this.sortingStation = null; // Reset sorting station selection
            this.currentQueue = null; // Reset current queue object
          },
          () => {
            this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось создать или обновить очередь.' });
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
