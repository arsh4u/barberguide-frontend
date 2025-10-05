import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ConfirmComponent} from './shared/confirm/confirm.component';
import {ToastComponent} from './shared/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'barberguide-frontend';
}
