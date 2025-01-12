import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  constructor() { }

  restoreLocale(): string {
    return localStorage.getItem("localeCode") || "en";
  }

  saveLocale(localeCode: string) {
    localStorage.setItem("localeCode", localeCode);
  }
}
