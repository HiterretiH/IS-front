import { AuthService } from './../../services/auth.service';
import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import {OperatorRequest, OperatorRequestsService} from "../../services/operator-requests.service";
import {ButtonModule} from "primeng/button";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";

@Component({
  selector: 'app-admin-request',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    ButtonModule,
    SharedModule,
    TableModule
  ],
  templateUrl: './operator-request.component.html',
  styleUrls: ['./operator-request.component.css']
})
export class OperatorRequestComponent implements OnInit{
  requests: OperatorRequest[] = [];
  isRequestSent: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private operatorRequestsService: OperatorRequestsService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
      this.operatorRequestsService.getAllMine(parseInt(this.authService.id)).subscribe({
        next: (data) => {
          this.requests = data;
          if (data.filter((req) => req.status === 'PENDING').length > 0) this.isRequestSent = true;
        },
        error: (err) => console.error('Failed to load my requests:', err)
      });
  }

  sendOperatorRequest() {
    this.operatorRequestsService.create(this.authService.id).subscribe({
      next: () => {
        this.errorMessage = null;
        this.loadRequests();
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
