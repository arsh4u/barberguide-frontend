import {Component} from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {ConfirmConfig, ConfirmService} from "../../core/services/confirm/confirm.service";

@Component({
    selector: 'app-confirm',
    imports: [
        NgIf,
        AsyncPipe
    ],
    templateUrl: './confirm.component.html',
    styleUrl: './confirm.component.scss',
    standalone: true
})
export class ConfirmComponent {
    confirmConfig$: Observable<ConfirmConfig | null>;

    constructor(private confirmService: ConfirmService) {
        this.confirmConfig$ = confirmService.getConfirmConfig(); // Obtém o estado atual do nosso confirm
    }

    onConfirm(): void {
        this.confirmService.handleConfirm();
    }

    onCancel(): void{
        this.confirmService.handleCancel();
    }
}
