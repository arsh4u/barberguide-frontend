import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {DialogComponent} from './shared/dialog/dialog.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'barberguide-frontend';
}
