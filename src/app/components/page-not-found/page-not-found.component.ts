import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { HeaderComponent } from '../header/header.component';


@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    CardModule,
    RouterLink,
    RouterLinkActive,
    HeaderComponent
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {

}
