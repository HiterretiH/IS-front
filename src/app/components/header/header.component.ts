import { AuthService } from '../../services/auth.service';
import {Component, OnInit} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import {OperatorService} from "../../services/operator.service";
import {ProductType} from "../../services/product-type.service";
import {ProductTypeJson} from "../../json";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ButtonModule,
    ToolbarModule,
    CardModule,
    CommonModule,
    RouterModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private authService: AuthService,
              private router: Router) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isPending(): boolean {
    return this.authService.isPending();
  }

  isUser(): boolean {
    return this.authService.isUser();
  }

  isOperator(): boolean {
    return this.authService.isOperator();
  }

  isManager(): boolean {
    return this.authService.isManager();
  }

  logOut(): void {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

  get username(): string {
    return this.authService.username;
  }
}
