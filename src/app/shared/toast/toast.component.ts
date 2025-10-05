import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {ToastData, ToastService} from '../../core/services/toast/toast.service';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [
    NgIf,
    AsyncPipe,
    NgForOf,
    NgClass
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  $toasts: Observable<ToastData[]>;

  constructor(private toastService: ToastService) {
    this.$toasts = toastService.getToasts();
  }

  // Permite que o usuário feche o toast manualmente
  close(id: number): void {
    this.toastService.remove(id);
  }
}
