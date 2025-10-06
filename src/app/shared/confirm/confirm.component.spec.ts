import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfirmComponent} from './confirm.component';
import {BehaviorSubject, Observable} from 'rxjs';
import {ConfirmConfig, ConfirmService} from '../../core/services/confirm/confirm.service';

describe('ConfirmComponent', () => {
  let component: ConfirmComponent;
  let fixture: ComponentFixture<ConfirmComponent>;

  // Mock de ConfirmService
  let mockConfirmService: {
    getConfirmConfig: () => BehaviorSubject<ConfirmConfig | null>,
    handleConfirm: () => jasmine.Spy,
    handleCancel: () => jasmine.Spy,
  };

  beforeEach(async () => {
    // Um BeahaviorSubject nos permite emitir valores para os "ouvintes" do nosso mockService
    const state$ = new BehaviorSubject<ConfirmConfig | null>(null);

    // Definir o mockService
    mockConfirmService = {
      getConfirmConfig: () => state$,
      handleConfirm: jasmine.createSpy('handleConfirm'),
      handleCancel: jasmine.createSpy('handleCancel'),
    }

    await TestBed.configureTestingModule({
      imports: [ConfirmComponent],
      providers: [
        {provide: ConfirmService, useValue: mockConfirmService}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not be visible when state is null', () => {
    const dialog = fixture.nativeElement.querySelector('.fixed.inset-0');
    expect(dialog).toBeNull();
  });

  it('should be visible and display data when state is not null', () => {
    // Mostra o diálogo
    mockConfirmService.getConfirmConfig().next({title: 'Test', message: 'Message test'});
    fixture.detectChanges(); // Update HTML

    const dialog = fixture.nativeElement.querySelector('.fixed.inset-0');
    expect(dialog).not.toBeNull();
    expect(fixture.nativeElement.querySelector('h3').textContent).toBe('Test');
    expect(fixture.nativeElement.querySelector('p').textContent).toContain('Message test');
  });

  it('should call handleConfirm() when the confirm button is clicked', () => {
    // Mostra o diálogo
    mockConfirmService.getConfirmConfig().next({title: 'Test', message: 'Message test'});
    fixture.detectChanges(); // Update HTML

    // Encontra o botão de confirma e clica nele
    const confirmButton = fixture.nativeElement.querySelector('button.bg-sky-400');
    expect(confirmButton).not.toBeNull();
    confirmButton.click();

    // Verifica se o método espião foi chamado
    expect(mockConfirmService.handleConfirm).toHaveBeenCalled();
  });


  it('should call handleCancel() when the cancel button is clicked', () => {
    // Mostra o diálogo
    mockConfirmService.getConfirmConfig().next({title: 'Test', message: 'Message test'});
    fixture.detectChanges(); // Update HTML

    // Encontra o botão de cancelar e clica nele
    const cancelButton = fixture.nativeElement.querySelector('button.bg-slate-200');
    expect(cancelButton).not.toBeNull();
    cancelButton.click();

    // Verifica se o método espião foi chamado
    expect(mockConfirmService.handleCancel).toHaveBeenCalled();
  });
})
;
