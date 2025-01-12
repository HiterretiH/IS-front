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
import { AdminRequestComponent } from './components/admin-request/admin-request.component';
import { adminGuard } from './admin.guard';
import { userGuard } from './user.guard';
import { CreateLocationComponent } from "./components/location/location.component";
import { CreateAddressComponent} from "./components/address/address.component";
import { CreateOrganizationComponent } from "./components/organization/organization.component";

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
    { path: 'create', component: CreationPageComponent, canActivate: [authGuard] },
    { path: 'search', component: SearchPageComponent, canActivate: [authGuard] },
    { path: 'admin', component: AdminPanelComponent, canActivate: [authGuard, adminGuard] },
    { path: 'admin-request', component: AdminRequestComponent, canActivate: [authGuard, userGuard] },
    { path: 'create-coordinates', component: CreateCoordinatesComponent, canActivate: [authGuard] },
    { path: 'create-location', component: CreateLocationComponent, canActivate: [authGuard] },
    { path: 'create-address', component: CreateAddressComponent, canActivate: [authGuard] },
    { path: 'create-organization', component: CreateOrganizationComponent, canActivate: [authGuard] },
    { path: '**', component: PageNotFoundComponent }
];