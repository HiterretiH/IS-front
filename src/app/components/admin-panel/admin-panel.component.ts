import { Component, OnInit } from '@angular/core';
import { OperatorRequestsService, OperatorRequest } from '../../services/operator-requests.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductTypeService, ProductType } from '../../services/product-type.service';
import { HeaderComponent } from "../header/header.component";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    HeaderComponent,
    ConfirmDialogModule,
    TableModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    NgIf,
  ],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class AdminPanelComponent implements OnInit {
  requests: OperatorRequest[] = [];
  productTypes: ProductType[] = [];
  selectedProductType: ProductType | null = null;
  displayDialog: boolean = false; // Modal visibility flag
  currentRequest: OperatorRequest | null = null; // Current request to approve/reject
  currentPage: number = 0; // Current page (0-based)
  totalPages: number = 1; // Total pages

  public showPendingOnly: boolean = true;

  constructor(
      private operatorRequestsService: OperatorRequestsService,
      private confirmationService: ConfirmationService,
      private messageService: MessageService,
      private productService: ProductTypeService // Inject ProductService
  ) {}

  ngOnInit(): void {
    this.loadRequests(); // Trigger loading of requests
    this.loadProductTypes(this.currentPage)
  }

  loadRequests(): void {
    if (this.showPendingOnly) {
      this.operatorRequestsService.getAllPending().subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.requests = data;
          } else {
            console.log('No pending requests available.');
            this.requests = [];
          }
        },
        error: (err) => {
          console.error('Failed to load pending requests:', err);
          this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось загрузить заявки' });
        },
      });
    } else {
      this.operatorRequestsService.getAll().subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.requests = data;
          } else {
            console.log('No requests available.');
            this.requests = [];
          }
        },
        error: (err) => {
          console.error('Failed to load all requests:', err);
          this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось загрузить заявки' });
        },
      });
    }
  }

  loadProductTypes(page: number): void {
    const pageSize = 10; // Number of items per page

    // Ensure page is within valid range
    if (page < 0 || page >= this.totalPages) return;

    // Fetch product types from the backend based on page and pageSize
    this.productService.getProductTypes(page, pageSize).subscribe({
      next: (response) => {
        if (response) {
          // Map the data array to an object with 'id' and 'name'
          this.productTypes = response.data.map(value => ({
            id: value[0],
            name: value[1]
          }));

          this.currentPage = page; // Update the current page
          this.totalPages = Math.floor(response.total / pageSize);
        } else {
          this.productTypes = [];
        }
      },
      error: (err) => {
        console.error('Failed to load product types:', err);
        this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось загрузить типы продуктов' });
      },
    });
  }

  approveRequest(request: OperatorRequest): void {
    this.currentRequest = request;
    this.displayDialog = true;
  }

  confirmApproveRequest(): void {
    if (this.selectedProductType && this.currentRequest) {
      this.operatorRequestsService.approve(this.currentRequest.id!, this.selectedProductType.id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Запрос подтвержден' });
          this.loadRequests();
          this.displayDialog = false; // Close the dialog after approval
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Ошибка подтверждения', detail: err.message });
        },
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Выберите тип продукта', detail: 'Необходимо выбрать тип продукта' });
    }
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
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Ошибка отклонения', detail: err.message });
          },
        });
      },
    });
  }
}
