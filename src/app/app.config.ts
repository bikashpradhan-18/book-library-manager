import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { mockBackendInterceptor } from './core/interceptors/mock-backend.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

provideHttpClient(
  withInterceptors([mockBackendInterceptor])
)

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(
      withInterceptors([mockBackendInterceptor])
    )
  ]
};
