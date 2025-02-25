import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    InputNumberModule
  ],
  templateUrl: './partner-create.component.html',
  styleUrls: ['./partner-create.component.css'],
  providers: [MessageService]
})
export class PartnerCreateComponent {
  partnerForm: FormGroup;
  user: UserJson = { id: 0, username: '' };

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

  onSubmit() {
    if (this.partnerForm.valid) {
      const partnerData: PartnerJson = {
        id: 0,
        name: this.partnerForm.value.name,
        email: this.partnerForm.value.email,
        phoneNumber: this.partnerForm.value.phoneNumber,
        address: this.partnerForm.value.address
      };

      this.partnerService.createPartner(partnerData).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Партнер создан!' });
          this.partnerForm.reset();
        },
        () => {
          this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось создать партнера.' });
        }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Пожалуйста, заполните все обязательные поля.' });
    }
  }

  get f() {
    return this.partnerForm.controls;
  }
}
