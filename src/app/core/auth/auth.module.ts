import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthService} from './auth.service';
import {StoreModule} from '@ngrx/store';
import {LoginComponent} from './login/login.component';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('auth', [])
  ],
})
export class AuthModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: AuthModule,
      providers: [AuthService]
    };
  }
}
