import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

export interface ConfirmConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  // BehaviorSubjec para controlar os dados e visibilidade do confirm
  private confirmConfig$ = new BehaviorSubject<ConfirmConfig | null>(null);

  // Subject para o resultado da ação do usuário
  private confirmResult$ = new BehaviorSubject<boolean>(false);

  // Método que os componentes chamarão para exibir o confirm "confirmService.confirm()" e obter o resultado da ação
  confirm(config: ConfirmConfig): Observable<boolean> {
    this.confirmConfig$.next(config);
    return this.confirmResult$.asObservable();
  }

  // Método que o component chamrá para confirmar ação "Confirmar"
  handleConfirm(): void {
    this.confirmConfig$.next(null); // Esconde o confirm
    this.confirmResult$.next(true); // Emite a ação do usuário
  }

  // Método que o component chamrá para confirmar ação "Cancelar"
  handleCancel(): void {
    this.confirmConfig$.next(null); // Esconde o confirm
    this.confirmResult$.next(false); // Emite a ação do usuário
  }

  // Método para obter o estado atual do confirm
  getConfirmConfig(): Observable<ConfirmConfig | null> {
    return this.confirmConfig$.asObservable();
  }
}
