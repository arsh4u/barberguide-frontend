import {TestBed} from '@angular/core/testing';

import {ConfirmConfig, ConfirmService} from './confirm.service';
import {take} from 'rxjs';

describe('ConfirmService', () => {
  let service: ConfirmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Teste 1: Verifica se o estado do diálogo é aberto corretamente
  it('should open dialog state when confirm() is called', (done: DoneFn) => {
    const testData: ConfirmConfig = {title: 'Test', message: 'Message test'};

    // Ouve o estado do diálogo
    service.getConfirmConfig().subscribe(state => {
      if (state) { // Ignora o estado inicial nulo
        expect(state).toEqual(testData);
        done(); // Finaliza o teste assíncrono
      }
    });

    // Ação: Chama o método para abrir o diálogo
    service.confirm(testData);
  });

  // Teste 2: Verifica se o resultado 'true' é emitido ao confirmar
  it('should emit true and close state when handleConfirm() is called', (done: DoneFn) => {
    const testData: ConfirmConfig = {title: 'Test', message: 'Message test'};

    // Ação: Chama o confirm() e se inscreve no resultado
    service.confirm(testData).pipe(take(1)).subscribe(result => {
      // Assert: Verifica se o restulda é verdadeiro
      expect(result).toBeTrue();
    });
    // Simula clique do usuário
    service.handleConfirm();

    // Verifica se o diálogo foi fechado (estado voltou para nulo)
    service.getConfirmConfig().subscribe(result => {
      expect(result).toBeNull();
      done();
    })
  });

  // Teste 3: Verifica se o resultado 'false' é emitido ao cancelar
  it('should emit false and clase state when handleCancel() is called ', (done: DoneFn) => {
    const testData: ConfirmConfig = {title: 'Test', message: 'Message test'};

    // Ação: Chama o confirm() e se inscreve no resultado
    service.confirm(testData).pipe(take(1)).subscribe(result => {
      // Assert: Verifica se o restulda é false
      expect(result).toBeFalse();
    });

    // Simula clique do usuário
    service.handleCancel();

    // Verifica se o diálogo foi fechado (estado voltou para nulo)
    service.getConfirmConfig().subscribe(result => {
      expect(result).toBeNull();
      done();
    })
  });
});
