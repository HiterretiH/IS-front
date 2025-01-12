import { Injectable } from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  mobile: boolean = false;
  tablet: boolean = false;
  desktop: boolean = true;

  private mobileQuery = "(max-width: 776.98px)";
  private tabletQuery = "(min-width: 777px) and (max-width: 1031.98px)";
  private desktopQuery = "(min-width: 1032px)";

  constructor(responsive: BreakpointObserver)
  {
    responsive.observe([
      this.desktopQuery,
      this.tabletQuery,
      this.mobileQuery
    ]).subscribe(
      (value) => {
        this.mobile = value.breakpoints[this.mobileQuery];
        this.tablet = value.breakpoints[this.tabletQuery];
        this.desktop = value.breakpoints[this.desktopQuery];
      }
    );
  }
}
