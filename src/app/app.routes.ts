import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './auth.guard';
import { guestGuard } from './guest.guard';
import { CreationPageComponent } from './components/creation-page/creation-page.component';
import { CreateCoordinatesComponent} from "./components/coordinates/coordinates.component";
import { SearchPageComponent } from './components/search-page/search-page.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { OperatorRequestComponent } from './components/operator-request/operator-request.component';
import { adminGuard } from './admin.guard';
import { userGuard } from './user.guard';
import { CreateOrganizationComponent } from "./components/organization/organization.component";
import { pendingGuard } from './pending.guard';
import { WaitingApprovalComponent } from './components/waiting-approval/waiting-approval.component';
import {HomeComponent} from "./components/home/home.component";
import {QueuesComponent} from "./components/queues/queues.component";
import {SortingStationService} from "./services/sorting-station.service";
import {SortingStationsComponent} from "./components/sorting-stations/sorting-stations.component";
import {WorkersComponent} from "./components/workers/workers.component";
import {PartnersComponent} from "./components/partners/partners.component";
import {LocationsComponent} from "./components/locations/locations.component";
import {WarehousesComponent} from "./components/warehouses/warehouses.component";

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [authGuard, pendingGuard] },
    { path: 'products', component: ProductsComponent, canActivate: [authGuard, pendingGuard] },
    { path: 'queues', component: QueuesComponent, canActivate: [authGuard, pendingGuard] },
    { path: 'sorting-stations', component: SortingStationsComponent, canActivate: [authGuard, pendingGuard] },
    { path: 'workers', component: WorkersComponent, canActivate: [authGuard, pendingGuard] },
    { path: 'partners', component: PartnersComponent, canActivate: [authGuard, pendingGuard] },
    { path: 'locations', component: LocationsComponent, canActivate: [authGuard, pendingGuard] },
    { path: 'warehouses', component: WarehousesComponent, canActivate: [authGuard, pendingGuard] },
    { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
    { path: 'create', component: CreationPageComponent, canActivate: [authGuard, pendingGuard] },
    { path: 'search', component: SearchPageComponent, canActivate: [authGuard, pendingGuard] },
    { path: 'admin', component: AdminPanelComponent, canActivate: [authGuard, pendingGuard, adminGuard] },
    { path: 'admin-request', component: OperatorRequestComponent, canActivate: [authGuard, pendingGuard, userGuard] },
    { path: 'waiting-approval', component: WaitingApprovalComponent },
    { path: '**', component: PageNotFoundComponent }
];