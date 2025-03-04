import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { StartingHeaderComponent } from '../starting-header/starting-header.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    ReactiveFormsModule, 
    PasswordModule,
    InputTextModule,
    RouterLink, 
    RouterLinkActive,
    CommonModule,
    DividerModule,
    StartingHeaderComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginError: boolean = false;

  form = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });

  constructor(private auth: AuthService,
              private router: Router) 
  {}

  onSubmit() {
    this.auth.login(this.form.value.username, this.form.value.password)
    .subscribe({
      next: (token) => {
        this.router.navigate(["/"]);
      },
      error: (error) => {
        this.loginError = true;
      }
    });
  }
}
