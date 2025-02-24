import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './auth.guard';
import { guestGuard } from './guest.guard';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { OperatorRequestComponent } from './components/operator-request/operator-request.component';
import { adminGuard } from './admin.guard';
import { userGuard } from './user.guard';
import { pendingGuard } from './pending.guard';
import { WaitingApprovalComponent } from './components/waiting-approval/waiting-approval.component';
import {HomeComponent} from "./components/home/home.component";
import {QueuesComponent} from "./components/queues/queues.component";
import {SortingStationService} from "./services/sorting-station.service";
import {SortingStationsComponent} from "./components/sorting-stations/sorting-stations.component";

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [authGuard, pendingGuard] },
    { path: 'products', component: ProductsComponent, canActivate: [authGuard, pendingGuard] },
    { path: 'queues', component: QueuesComponent, canActivate: [authGuard, pendingGuard] },
    { path: 'sorting-stations', component: SortingStationsComponent, canActivate: [authGuard, pendingGuard] },
    { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
    { path: 'admin', component: AdminPanelComponent, canActivate: [authGuard, pendingGuard, adminGuard] },
    { path: 'admin-request', component: OperatorRequestComponent, canActivate: [authGuard, pendingGuard, userGuard] },
    { path: 'waiting-approval', component: WaitingApprovalComponent },
    { path: '**', component: PageNotFoundComponent }
];