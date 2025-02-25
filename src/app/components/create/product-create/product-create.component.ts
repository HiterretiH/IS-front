import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../../services/product.service';
import { LocationService } from '../../../services/location.service';
import { PartnerService } from '../../../services/partner.service';
import { QueueService } from '../../../services/queue.service';
import { ProductTypeService } from '../../../services/product-type.service';
import { ProductJson, LocationJson, PartnerJson, QueueJson, ProductTypeJson, ProductState } from '../../../json';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    ToastModule,
    CommonModule,
    DropdownModule,
    CalendarModule,
    InputNumberModule
  ],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
  providers: [MessageService]
})
export class ProductCreateComponent {
  productForm: FormGroup;
  location: LocationJson | null = null;
  supplier: PartnerJson | null = null;
  customer: PartnerJson | null = null;
  queue: QueueJson | null = null;
  productType: ProductTypeJson | null = null;

  productStates = Object.values(ProductState);

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private locationService: LocationService,
    private partnerService: PartnerService,
    private queueService: QueueService,
    private productTypeService: ProductTypeService,
    private messageService: MessageService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      expirationDate: [''],
      productState: ['', Validators.required],
      priority: [null],
      locationId: [null, Validators.required],
      supplierId: [null, Validators.required],
      customerId: [null, Validators.required],
      queueId: [null],
      productTypeId: [null, Validators.required]
    });
  }

  checkLocation() {
    const locationId = this.productForm.get('locationId')?.value;
    if (locationId) {
      this.locationService.getById(locationId).subscribe(
        (location) => this.location = location,
        () => this.location = null
      );
    }
  }

  checkPartner(type: 'supplier' | 'customer') {
    const partnerId = this.productForm.get(`${type}Id`)?.value;
    if (partnerId) {
      this.partnerService.getById(partnerId).subscribe(
        (partner) => type === 'supplier' ? this.supplier = partner : this.customer = partner,
        () => type === 'supplier' ? this.supplier = null : this.customer = null
      );
    }
  }

  checkQueue() {
    const queueId = this.productForm.get('queueId')?.value;
    if (queueId) {
      this.queueService.getById(queueId).subscribe(
        (queue) => this.queue = queue,
        () => this.queue = null
      );
    }
  }

  checkProductType() {
    const productTypeId = this.productForm.get('productTypeId')?.value;
    if (productTypeId) {
      this.productTypeService.getById(productTypeId).subscribe(
        (productType) => this.productType = productType,
        () => this.productType = null
      );
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      if (!this.location || !this.supplier || !this.customer || !this.queue || !this.productType) {
        this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Выберите корректные данные.' });
        return;
      }

      const productData: ProductJson = {
        id: 0,
        name: this.productForm.value.name,
        description: this.productForm.value.description,
        expirationDate: this.productForm.value.expirationDate,
        productState: this.productForm.value.productState,
        priority: this.productForm.value.priority,
        location: this.location,
        supplier: this.supplier,
        customer: this.customer,
        queue: this.queue,
        productType: this.productType
      };

      this.productService.createProduct(productData).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Продукт создан!' });
          this.productForm.reset();
        },
        () => {
          this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось создать продукт.' });
        }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Заполните все обязательные поля.' });
    }
  }

  get f() {
    return this.productForm.controls;
  }
}
