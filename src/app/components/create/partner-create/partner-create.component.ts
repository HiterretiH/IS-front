import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PartnerService } from '../../../services/partner.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { PartnerJson, UserJson } from '../../../json';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-partner-create',
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
  templateUrl: './partner-create.component.html',
  styleUrls: ['./partner-create.component.css'],
  providers: [MessageService]
})
export class PartnerCreateComponent implements OnInit {
  partnerForm: FormGroup;
  user: UserJson = { id: 0, username: '' };
  partnerIdInput: number | null = null;
  selectedPartnerId: number | null = null;

  constructor(
      private fb: FormBuilder,
      private partnerService: PartnerService,
      private authService: AuthService,
      private messageService: MessageService
  ) {
    this.partnerForm = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(150)]],
      email: [null, [Validators.required, Validators.email]],
      phoneNumber: [null, [Validators.required, Validators.maxLength(20)]],
      address: [null]
    });

    this.user.username = this.authService.username;
  }

  ngOnInit() {
  }

  onPartnerLoad() {
    if (this.partnerIdInput) {
      this.partnerService.getById(this.partnerIdInput).subscribe(
          (partner: PartnerJson) => {
            this.selectedPartnerId = partner.id;
            this.partnerForm.patchValue({
              name: partner.name,
              email: partner.email,
              phoneNumber: partner.phoneNumber,
              address: partner.address
            });
            this.messageService.add({ severity: 'info', summary: 'Партнер загружен', detail: 'Данные партнера загружены.' });
          },
          () => {
            this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось найти партнера.' });
          }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Введите корректный ID партнера.' });
    }
  }

  onSubmit() {
    if (this.partnerForm.valid) {
      const partnerData: PartnerJson = {
        id: this.selectedPartnerId || 0,
        name: this.partnerForm.value.name,
        email: this.partnerForm.value.email,
        phoneNumber: this.partnerForm.value.phoneNumber,
        address: this.partnerForm.value.address
      };

      if (this.selectedPartnerId) {
        this.partnerService.updatePartner(partnerData.id, partnerData).subscribe(
            () => {
              this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Партнер обновлен!' });
              this.partnerForm.reset();
              this.selectedPartnerId = null;
            },
            () => {
              this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось обновить партнера.' });
            }
        );
      } else {
        this.partnerService.createPartner(partnerData).subscribe(
            () => {
              this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Партнер создан!' });
              this.partnerForm.reset();
            },
            () => {
              this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось создать партнера.' });
            }
        );
      }
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Пожалуйста, заполните все обязательные поля.' });
    }
  }

  delete() {
    if (this.selectedPartnerId) {
      this.partnerService.deletePartner(this.selectedPartnerId).subscribe(
        () => {
          this.messageService.add({ severity: 'info', summary: 'Партнер удален', detail: 'Партнер успешно удален.' });
          this.partnerForm.reset();
          this.selectedPartnerId = null;
        },
        () => {
          this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Ошибка удаления партнера.' });
        }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Введите корректный ID партнера.' });
    }
  }

  get f() {
    return this.partnerForm.controls;
  }
}
