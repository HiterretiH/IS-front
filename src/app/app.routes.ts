import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
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
import { CreateLocationComponent } from "./components/location/location.component";
import { CreateAddressComponent} from "./components/address/address.component";
import { CreateOrganizationComponent } from "./components/organization/organization.component";
import { pendingGuard } from './pending.guard';
import { WaitingApprovalComponent } from './components/waiting-approval/waiting-approval.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [authGuard, pendingGuard] },
    { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
    { path: 'create', component: CreationPageComponent, canActivate: [authGuard, pendingGuard] },
    { path: 'search', component: SearchPageComponent, canActivate: [authGuard, pendingGuard] },
    { path: 'admin', component: AdminPanelComponent, canActivate: [authGuard, pendingGuard, adminGuard] },
    { path: 'admin-request', component: OperatorRequestComponent, canActivate: [authGuard, pendingGuard, userGuard] },
    { path: 'create-coordinates', component: CreateCoordinatesComponent, canActivate: [authGuard, pendingGuard] },
    { path: 'create-location', component: CreateLocationComponent, canActivate: [authGuard, pendingGuard] },
    { path: 'create-address', component: CreateAddressComponent, canActivate: [authGuard, pendingGuard] },
    { path: 'create-organization', component: CreateOrganizationComponent, canActivate: [authGuard, pendingGuard] },
    { path: 'waiting-approval', component: WaitingApprovalComponent },
    { path: '**', component: PageNotFoundComponent }
];