import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withIncrementalHydration,
} from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { headerInterceptor } from './interceptors/header.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
      withViewTransitions(),
    ),
    provideClientHydration(withIncrementalHydration()),
    provideHttpClient(
      withFetch(),
      withInterceptors([headerInterceptor, errorInterceptor]),
    ),
    importProvidersFrom(NgxSpinnerModule),
  ],
};
