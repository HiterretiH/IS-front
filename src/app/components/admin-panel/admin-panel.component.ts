import { Component, OnInit } from '@angular/core';
import { OperatorRequestsService, OperatorRequest } from '../../services/operator-requests.service';
import { AuthService } from '../../services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HeaderComponent } from '../header/header.component';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    HeaderComponent,
    TableModule,
    CommonModule,
    ButtonModule,
    ConfirmDialogModule
  ],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class AdminPanelComponent implements OnInit {
  requests: OperatorRequest[] = [];
  public showPendingOnly: boolean = true;

  constructor(
    private operatorRequestsService: OperatorRequestsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    if (this.showPendingOnly) {
      this.operatorRequestsService.getAllPending().subscribe({
        next: (data) => this.requests = data,
        error: (err) => console.error('Failed to load pending requests:', err)
      });
    } else {
      this.operatorRequestsService.getAll().subscribe({
        next: (data) => this.requests = data,
        error: (err) => console.error('Failed to load all requests:', err)
      });
    }
  }

  approveRequest(request: OperatorRequest): void {
    this.confirmationService.confirm({
      message: `Вы уверены, что хотите подтвердить запрос?`,
      accept: () => {
        this.operatorRequestsService.approve(request.id!).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Запрос подтвержден' });
            this.loadRequests();
          },
          error: (err) => this.messageService.add({ severity: 'error', summary: 'Ошибка подтверждения', detail: err.message })
        });
      }
    });
  }

  rejectRequest(request: OperatorRequest): void {
    this.confirmationService.confirm({
      message: `Вы уверены, что хотите отклонить запрос?`,
      accept: () => {
        this.operatorRequestsService.reject(request.id!).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Запрос отклонен' });
            this.loadRequests();
          },
          error: (err) => this.messageService.add({ severity: 'error', summary: 'Ошибка отклонения', detail: err.message })
        });
      }
    });
  }
}
