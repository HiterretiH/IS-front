import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { AdminRequestService } from '../../services/admin-request.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-request',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule
  ],
  templateUrl: './admin-request.component.html',
  styleUrls: ['./admin-request.component.css']
})
export class AdminRequestComponent {
  isRequestSent: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private adminRequestService: AdminRequestService, 
    private router: Router,
    private authService: AuthService
  ) {}

  sendAdminRequest() {
    this.adminRequestService.sendRequest(this.authService.username).subscribe({
      next: (response) => {
        this.isRequestSent = true;
        this.errorMessage = null;
      },
      error: (error) => {
        console.log(error);
        this.errorMessage = 'Ошибка при отправке запроса. Попробуйте позже.';
        this.isRequestSent = false;
      }
    });
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
