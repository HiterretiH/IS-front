import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {SortingStationService} from "../../services/sorting-station.service";

@Component({
  selector: 'app-sorting-stations',
  templateUrl: './sorting-stations.component.html',
  styleUrls: ['./sorting-stations.component.css'],
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    FormsModule,
  ]
})
export class SortingStationsComponent implements OnInit {
  sortingStations: any[] = [];
  totalSortingStations: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  totalPages: number = 1;

  constructor(private sortingStationService: SortingStationService) {}

  ngOnInit(): void {
    this.loadSortingStations();
  }

  loadSortingStations(): void {
    this.sortingStationService.getAll(this.pageIndex, this.pageSize).subscribe(
        (sortingStations: {data: string[], total: number}) => {
          this.totalSortingStations = sortingStations.total;
          this.totalPages = Math.ceil(this.totalSortingStations / this.pageSize);
          this.sortingStations = sortingStations.data.map(sortingStationString => JSON.parse(sortingStationString));
        },
        (error) => {
          console.error('Error loading products:', error);
        }
    );
  }

  nextPage(): void {
    if (this.pageIndex < this.totalPages - 1) {
      this.pageIndex++;
      this.loadSortingStations();
    }
  }

  prevPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.loadSortingStations();
    }
  }
}
