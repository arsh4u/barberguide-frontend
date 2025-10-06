import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ToastComponent} from './toast.component';
import {BehaviorSubject} from 'rxjs';
import {ToastData, ToastService} from '../../core/services/toast/toast.service';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  // Mock do ToastService
  let mockService: {
    getToasts: () => BehaviorSubject<ToastData[]>,
    show: jasmine.Spy,
    remove: jasmine.Spy,
  }

  beforeEach(async () => {
    // Um BehaviorSubject para os inscritos no mockService
    const toasts$ = new BehaviorSubject<ToastData[]>([]);

    // Define o mockService
    mockService = {
      getToasts: () => toasts$,
      show: jasmine.createSpy('show'),
      remove: jasmine.createSpy('remove'),
    }

    await TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [
        {provide: ToastService, useValue: mockService}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render any toasts by default', () => {
    const toast = fixture.nativeElement.querySelector('.w-80');
    expect(toast).toBeNull();
  });

  it('should be visible and display data when toasts is not null', () => {
    // Mostra o toast
    mockService.getToasts().next([
      {id: 1, title: 'Test', message: 'Message test', type: 'success'}
    ]);
    fixture.detectChanges(); // Update HTML

    const toast = fixture.nativeElement.querySelector('.w-80');
    expect(toast).not.toBeNull();
    expect(fixture.nativeElement.querySelector('h4').textContent).toBe('Test');
    expect(fixture.nativeElement.querySelector('span').textContent).toContain('Message test');
  });

  it('should apply correct color class based on toast type', () => {
    // Cenário 1: Toast de Sucesso (verde)
    const successToast: ToastData = {id: 1, message: 'Success!', type: 'success'};
    mockService.getToasts().next([successToast]);
    fixture.detectChanges(); // Renderiza o toast

    const successElement = fixture.nativeElement.querySelector('.w-80');
    expect(successElement.classList.contains('bg-green-500')).toBeTrue();
    expect(successElement.classList.contains('bg-red-500')).toBeFalse();

    // Cenário 2: Toast de Erro (vermelho)
    const errorToast: ToastData = {id: 2, message: 'Error!', type: 'error'};
    mockService.getToasts().next([errorToast]);
    fixture.detectChanges(); // Renderiza o novo toast

    const errorElement = fixture.nativeElement.querySelector('.w-80');
    expect(errorElement.classList.contains('bg-red-500')).toBeTrue();
    expect(errorElement.classList.contains('bg-green-500')).toBeFalse();

    // Cenário 3: Toast de Alerta (amarelo)
    const warningToast: ToastData = {id: 3, message: 'Warning!', type: 'warning'};
    mockService.getToasts().next([warningToast]);
    fixture.detectChanges(); // Renderiza o novo toast

    const warningElement = fixture.nativeElement.querySelector('.w-80');
    expect(warningElement.classList.contains('bg-yellow-500')).toBeTrue();
    expect(warningElement.classList.contains('bg-red-500')).toBeFalse();

    // Cenário 4: Toast de Informação (azul)
    const infoToast: ToastData = {id: 3, message: 'Info!', type: 'info'};
    mockService.getToasts().next([infoToast]);
    fixture.detectChanges(); // Renderiza o novo toast

    const infoElement = fixture.nativeElement.querySelector('.w-80');
    expect(infoElement.classList.contains('bg-blue-500')).toBeTrue();
    expect(infoElement.classList.contains('bg-yellow-500')).toBeFalse();
  });

  it('should call service.remove() when close button is clicked', () => {
    const testToast: ToastData = {id: 123, title: 'Test', message: 'Message test', type: 'success'};

    // Mostra o toast
    mockService.getToasts().next([testToast]);
    fixture.detectChanges(); // Update HTML

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(mockService.remove).toHaveBeenCalledWith(123);
  });
});
