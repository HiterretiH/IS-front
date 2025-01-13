import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { OperatorRequestsService, OperatorRequest } from '../../services/operator-requests.service';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-waiting-approval',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule
  ],
  templateUrl: './waiting-approval.component.html',
  styleUrls: ['./waiting-approval.component.css']
})
export class WaitingApprovalComponent implements OnInit {
  pending: boolean = false;
  accepted: boolean = false;
  rejected: boolean = false;

  constructor(
    private operatorRequestsService: OperatorRequestsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.operatorRequestsService.getByUsername(this.authService.username).subscribe({
      next: (request: OperatorRequest) => {
        if (request) {
            const status = request.status;

            this.authService.updateRole();

            if (status === 'PENDING') {
              this.pending = true;
            } else if (status === 'ACCEPTED') {
              this.accepted = true;
            } else if (status === 'REJECTED') {
              this.rejected = true;
          }
        }
      },
      error: (err) => {
        console.error('Failed to fetch operator request:', err);
      }
    });
  }
}
