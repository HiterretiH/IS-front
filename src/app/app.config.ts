import { BreakpointObserver } from '@angular/cdk/layout';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LocaleService } from './services/locale.service';
import { LayoutService } from './services/layout.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/lab4/assets/i18n/');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    AuthService,
    LocaleService,
    LayoutService,
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    })),
    importProvidersFrom(BreakpointObserver)
  ]
};
