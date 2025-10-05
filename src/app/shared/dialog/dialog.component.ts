import {Component} from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {DialogConfig, DialogService} from "../../core/services/dialog.service";

@Component({
    selector: 'app-dialog',
    imports: [
        NgIf,
        AsyncPipe
    ],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
    standalone: true
})
export class DialogComponent {
    dialogConfig$: Observable<DialogConfig | null>;

    constructor(private dialogService: DialogService) {
        this.dialogConfig$ = dialogService.getDialogConfig(); // Obtém o estado atual do nosso dialog
    }

    onConfirm(): void {
        this.dialogService.handleConfirm();
    }

    onCancel(): void{
        this.dialogService.handleCancel();
    }
}
