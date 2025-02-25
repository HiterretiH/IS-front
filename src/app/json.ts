export interface UserJson {
    id: number;
    username: string;
}

export interface LocationJson {
    id: number;
    name: string;
    description: string;
    locationRow: number;
}

export interface PartnerJson {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
}

export interface WarehouseJson {
    id: number;
    name: string;
    address: string;
}

export interface WorkerJson {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    birthDate: string;
    hireDate: string;
    status: Status;
    warehouse: WarehouseJson;
}

export enum Status {
    HIRED = 'HIRED',
    FIRED = 'FIRED',
    PENDING = 'PENDING',
    REJECTED = 'REJECTED'
}

export interface SortingStationJson {
    id: number;
    warehouse: WarehouseJson;
    location: LocationJson;
    capacity: number;
    sortTimeSeconds: number;
}
  
  export interface ProductTypeJson {
    id: number;
    name: string;
  }
  
  export interface QueueJson {
    id: number;
    capacity: number;
    sortingStation: SortingStationJson;
  }
  
  export enum ProductState {
    PENDING = "PENDING",
    SORTING_TO_STORE = "SORTING_TO_STORE",
    SORTING_TO_SHIP = "SORTING_TO_SHIP",
    STORED = "STORED",
    SHIPPED = "SHIPPED",
    DISPOSED = "DISPOSED"
  }
  
  export interface ProductJson {
    id: number;
    productType: ProductTypeJson;
    location: LocationJson;
    supplier: PartnerJson;
    customer: PartnerJson;
    queue: QueueJson | null;
    name: string;
    description: string | null;
    expirationDate: string | null;
    productState: ProductState;
    priority: number | null;
  }
  