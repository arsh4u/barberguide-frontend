import {fakeAsync, TestBed, tick} from '@angular/core/testing';

import {ToastData, ToastService} from './toast.service';

fdescribe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Teste 1: Verifica se um toast foi adicionado a lista
  it('should add toast to list', (done: DoneFn) => {
    const message = 'Message test', type = 'success', title = 'Test';
    service.getToasts().subscribe(toasts => {
      if (toasts.length > 0) { // Ignora o estado inicial vazio
        expect(toasts.length).toBe(1); // A expectativa é que tenha apenas 1 toast na stack
        expect(toasts[0].id).toBe(0); // A expectativa é que o id do primeiro seja 0
        expect(toasts[0].message).toBe(message); // A expectativa é que a mensagem seja do nosso teste
        expect(toasts[0].type).toBe(type); // A expectativa é que a type seja do nosso teste
        expect(toasts[0].title).toBe(title); // A expectativa é que a title seja do nosso teste
        done();
      }
    });

    // Ação: exibe o toast de sucesso
    service.show(message, type, title);
  });

  // Teste 2: Verifica se um toast é removido manualmente
  fit('should remove toast manually from list', fakeAsync(() => {
    const message1 = 'Message test 1', type1 = 'success';
    const message2 = 'Message test 2', type2 = 'info';

    // Ação: exibe os toasts
    service.show(message1, type1);
    service.show(message2, type2);

    // Verifica se os toasts foram adicionados
    let currentToasts: ToastData[] = [];
    service.getToasts().subscribe(toasts => currentToasts = toasts);
    expect(currentToasts.length).toBe(2); // A expectativa é que tenha 2 toasts na stack

    // Ação: Simula remoção pelo usuário
    service.remove(0);

    // Assert: Verifica se a lista de toasts está vazia agora
    expect(currentToasts.length).toBe(1);
  }));

  // Teste 3: Verifica se um toast é removido automaticamente (após 5 segundos)
  fit('should remove toast automatic before 5 seconds from list', fakeAsync(() => {
    const message = 'Message test', type = 'success';

    // Ação: exibe o toast de sucesso
    service.show(message, type);

    // Verifica se o toast foi adicionado
    let currentToasts: ToastData[] = [];
    service.getToasts().subscribe(toasts => currentToasts = toasts);
    expect(currentToasts.length).toBe(1); // A expectativa é que tenha apenas 1 toast na stack
    expect(currentToasts[0].id).toBe(0); // A expectativa é que o id do primeiro seja 1
    expect(currentToasts[0].message).toBe(message); // A expectativa é que a mensagem seja do nosso teste
    expect(currentToasts[0].type).toBe(type); // A expectativa é que a type seja do nosso teste

    // Avançar o "time" em 5 segundos
    tick(5000);

    // Assert: Verifica se a lista de toasts está vazia agora
    expect(currentToasts.length).toBe(0);
  }));
});
