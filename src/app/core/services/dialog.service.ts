import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

export interface DialogConfig {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    // BehaviorSubjec para controlar os dados e visibilidade do dialog
    private dialogConfig$ = new BehaviorSubject<DialogConfig | null>(null);

    // Subject para o resultado da ação do usuário
    private dialogResult$ = new BehaviorSubject<boolean>(false);

    // Método que os componentes chamarão para exibir o dialog "dialogService.confirm()" e obter o resultado da ação
    confirm(config: DialogConfig): Observable<boolean> {
        this.dialogConfig$.next(config);
        return this.dialogResult$.asObservable();
    }

    // Método que o component chamrá para confirmar ação "Confirmar"
    handleConfirm(): void {
        this.dialogConfig$.next(null); // Esconde o dialog
        this.dialogResult$.next(true); // Emite a ação do usuário
    }

    // Método que o component chamrá para confirmar ação "Cancelar"
    handleCancel(): void {
        this.dialogConfig$.next(null); // Esconde o dialog
        this.dialogResult$.next(false); // Emite a ação do usuário
    }

    // Método para obter o estado atual do dialog
    getDialogConfig(): Observable<DialogConfig | null> {
        return this.dialogConfig$.asObservable();
    }
}
