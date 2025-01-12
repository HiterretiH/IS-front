import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

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
  templateUrl: './starting-header.component.html',
  styleUrl: './starting-header.component.css'
})
export class StartingHeaderComponent {

}
