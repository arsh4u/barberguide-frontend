import {ApplicationConfig, isDevMode, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {appRoutes} from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import {provideState, provideStore} from '@ngrx/store';
import {ConfirmService} from './core/services/confirm/confirm.service';
import {ToastService} from './core/services/toast/toast.service';
import {provideEffects} from '@ngrx/effects';
import {provideStoreDevtools} from '@ngrx/store-devtools';
import {ProfessionalsEffects} from './features/professionals/store/professionals.effects';
import {professionalsFeature} from './features/professionals/store/professionals.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideStore(),
    provideEffects([ProfessionalsEffects]),
    provideState(professionalsFeature),
    provideStoreDevtools({maxAge: 25, logOnly: !isDevMode()}),

    ConfirmService,
    ToastService
  ]
};
