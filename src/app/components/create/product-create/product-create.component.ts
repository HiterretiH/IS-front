import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../../services/product.service';
import { LocationService } from '../../../services/location.service';
import { PartnerService } from '../../../services/partner.service';
import { QueueService } from '../../../services/queue.service';
import { ProductTypeService } from '../../../services/product-type.service';
import { ProductJson, LocationJson, PartnerJson, QueueJson, ProductTypeJson, ProductState, SortingStationJson } from '../../../json';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import {SortingStationService} from "../../../services/sorting-station.service";

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
    InputNumberModule,
    FormsModule
  ],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
  providers: [MessageService]
})
export class ProductCreateComponent {
  productForm: FormGroup;
  productIdInput: string = '';
  location: LocationJson | null = null;
  supplier: PartnerJson | null = null;
  customer: PartnerJson | null = null;
  queue: QueueJson | null = null;
  productType: ProductTypeJson | null = null;
  product: ProductJson | null = null;
  sortingStation: SortingStationJson | null = null;
  currentProduct: ProductJson | null = null; // For holding current product if editing

  productStates = Object.values(ProductState);

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private locationService: LocationService,
    private partnerService: PartnerService,
    private queueService: QueueService,
    private productTypeService: ProductTypeService,
    private messageService: MessageService,
    private sortingStationService: SortingStationService
  ) {
    this.productForm = this.fb.group({
      id: [''],
      sortingStationId: [''],
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

    // Watch for changes in the form fields related to partners, location, queue, and product type
    this.productForm.get('locationId')?.valueChanges.subscribe(() => {
      this.checkLocation();
    });
    this.productForm.get('supplierId')?.valueChanges.subscribe(() => {
      this.checkPartner('supplier');
    });
    this.productForm.get('customerId')?.valueChanges.subscribe(() => {
      this.checkPartner('customer');
    });
    this.productForm.get('queueId')?.valueChanges.subscribe(() => {
      this.checkQueue();
    });
    this.productForm.get('productTypeId')?.valueChanges.subscribe(() => {
      this.checkProductType();
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

  checkProduct() {
    const productId = this.productForm.get('id')?.value;
    if (productId) {
      this.productService.getById(productId).subscribe(
        (res) => this.product = res,
        () => this.product = null
      );
    }
  }

  checkSortingStation() {
    const sortingStationId = this.productForm.get('sortingStationId')?.value;
    if (sortingStationId) {
      this.sortingStationService.getById(sortingStationId).subscribe(
        (res) => this.sortingStation = res,
        () => this.sortingStation = null
      );
    }
  }

  disposeProduct() {
    if (this.product) {
      this.productService.disposeProduct(this.product.id).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Продукт утилизирован!' });
          this.productForm.reset();
        },
        () => {
          this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось утилизировать продукт.' });
        }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Выберите продукт.' });
    }
  }

  sortToShip() {
    if (this.product && this.sortingStation) {
      this.productService.sortToShip(this.product.id, this.sortingStation.id).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Продукт отсортирован для отправки!' });
          this.productForm.reset();
        },
        () => {
          this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось отсортировать продукт для отправки.' });
        }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Выберите продукт и пункт отправки.' });
    }
  }

  sortToStore() {
    if (this.product && this.sortingStation) {
      this.productService.sortToStore(this.product.id, this.sortingStation.id).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Успех', detail: 'Продукт отсортирован для хранения!' });
          this.productForm.reset();
        },
        () => {
          this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось отсортировать продукт для хранения.' });
        }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Выберите продукт и пункт хранения.' });
    }
  }

  setProductPriority() {

  }

  // Load the product for editing using the provided product ID
  onProductLoad() {
    if (this.productIdInput) {
      this.productService.getById(parseInt(this.productIdInput, 10)).subscribe(
          (product) => {
            this.currentProduct = product;
            this.productForm.patchValue({
              name: product.name,
              description: product.description,
              expirationDate: product.expirationDate,
              productState: product.productState,
              priority: product.priority,
              locationId: product.location.id,
              supplierId: product.supplier.id,
              customerId: product.customer.id,
              queueId: product.queue.id,
              productTypeId: product.productType.id
            });

            this.location = product.location;
            this.supplier = product.supplier;
            this.customer = product.customer;
            this.queue = product.queue;
            this.productType = product.productType;
          },
          () => {
            this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось загрузить продукт.' });
          }
      );
    }
  }

  // Handle the form submission for creating or updating a product
  onSubmit() {
    if (this.productForm.valid) {
      if (!this.location || !this.supplier || !this.customer || !this.queue || !this.productType) {
        this.messageService.add({ severity: 'warn', summary: 'Ошибка', detail: 'Выберите корректные данные.' });
        return;
      }

      const productData: ProductJson = {
        id: this.currentProduct ? this.currentProduct.id : 0, // Use the existing product ID if editing
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

      const productRequest$ = this.currentProduct
          ? this.productService.updateProduct(productData.id, productData) // Update if editing
          : this.productService.createProduct(productData); // Create if new

      productRequest$.subscribe(
          () => {
            this.messageService.add({ severity: 'success', summary: 'Успех', detail: this.currentProduct ? 'Продукт обновлен!' : 'Продукт создан!' });
            this.productForm.reset();
            this.location = null;
            this.supplier = null;
            this.customer = null;
            this.queue = null;
            this.productType = null;
            this.currentProduct = null; // Reset the current product object
          },
          () => {
            this.messageService.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось создать или обновить продукт.' });
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
