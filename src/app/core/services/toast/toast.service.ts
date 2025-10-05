import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface ToastData {
  id: number;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  // Stack de toasts
  private toasts$ = new BehaviorSubject<ToastData[]>([]);

  // Id do toast
  private toastId = 0;

  constructor() {
  }

  // Expõe a stack de toast
  getToasts(): Observable<ToastData[]> {
    return this.toasts$.asObservable();
  }

  // Método principal para exibir um novo toast
  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success', title?: string): void {
    const id = this.toastId++;
    const newToast = {id, title, message, type};

    // Adiciona o novo toast a stack
    this.toasts$.next([...this.toasts$.value, newToast]);

    // Agenda a remoção do toast para 5 segundos
    setTimeout(() => this.remove(id), 5000);
  }

  // Remove o toast da lista pelo ID
  remove(id: number): void {
    const updatedToasts = this.toasts$.value.filter(toast => toast.id !== id);
    this.toasts$.next(updatedToasts);
  }
}
