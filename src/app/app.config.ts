import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {appRoutes} from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import {provideStore} from '@ngrx/store';
import {ConfirmService} from './core/services/confirm/confirm.service';
import {ToastService} from './core/services/toast/toast.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideStore(),
    ConfirmService,
    ToastService
  ]
};
