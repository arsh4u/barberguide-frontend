import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {ProfessionalDetailComponent} from './professional-detail.component';
import {ActivatedRoute, provideRouter} from '@angular/router';
import {appRoutes} from '../../../app.routes';
import {ConfirmService} from '../../../core/services/confirm/confirm.service';
import {ToastService} from '../../../core/services/toast/toast.service';
import {ProfessionalService} from '../professional.service';
import {User} from '../../../core/models/user.model';
import {of, Subject} from 'rxjs';
import {By} from '@angular/platform-browser';

describe('ProfessionalDetailComponent', () => {
  let component: ProfessionalDetailComponent;
  let fixture: ComponentFixture<ProfessionalDetailComponent>;

  // Mocks Services
  let mockProfessionalService: jasmine.SpyObj<ProfessionalService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockConfirmService: jasmine.SpyObj<ConfirmService>;

  const mockProfessional: User = {id: 1, name: 'Dr. Barber', email: 'barber@gmail.com', role: 'profissional'};

  beforeEach(async () => {
    // Spies for mockServices
    const professionalServiceSpy = jasmine.createSpyObj('ProfessionalService', [
      'getProfessionalById', 'getAvailability', 'createAppointment'
    ]);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    const confirmServiceSpy = jasmine.createSpyObj('ConfirmService', ['confirm']);

    await TestBed.configureTestingModule({
      imports: [ProfessionalDetailComponent],
      providers: [
        provideRouter(appRoutes),
        {provide: ProfessionalService, useValue: professionalServiceSpy},
        {provide: ToastService, useValue: toastServiceSpy},
        {provide: ConfirmService, useValue: confirmServiceSpy},
        // Mock for ActivatedRoute simulating param ID in URL
        {provide: ActivatedRoute, useValue: {snapshot: {params: {id: mockProfessional.id} as any}}},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfessionalDetailComponent);
    component = fixture.componentInstance;

    // Inject mocks
    mockProfessionalService = TestBed.inject(ProfessionalService) as jasmine.SpyObj<ProfessionalService>;
    mockToastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    mockConfirmService = TestBed.inject(ConfirmService) as jasmine.SpyObj<ConfirmService>;

    // Default return mocks
    mockProfessionalService.getProfessionalById.and.returnValue(of(mockProfessional));
    mockProfessionalService.getAvailability.and.returnValue(of({available_times: ['10:00', '11:00']}));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create and fetch professional details on init', () => {
    // Act
    fixture.detectChanges();

    // Assert: Verifica se os serviços foram chamados com os parâmetros corretos
    expect(mockProfessionalService.getProfessionalById).toHaveBeenCalledWith(mockProfessional.id);
    expect(mockProfessionalService.getAvailability).toHaveBeenCalled();
    expect(component).toBeTruthy();

    // Verifica se o nome do profissional foi renderizado
    const titleElement = fixture.nativeElement.querySelector('.professional-name');
    const emailElement = fixture.nativeElement.querySelector('.professional-email');
    expect(titleElement.textContent).toContain(mockProfessional.name);
    expect(emailElement.textContent).toContain(mockProfessional.email);
  });

  it('should display available time slots', () => {
    // Arrange
    fixture.detectChanges();

    // Assert
    const titleSection = fixture.debugElement.query(By.css('h4.text-lg'));
    expect(titleSection).not.toBeNull();
    expect(titleSection.nativeElement.textContent.trim()).toContain('Horários disponíveis');
    const timeButtons = fixture.debugElement.queryAll(By.css('button.border-sky-500'));
    expect(timeButtons.length).toBe(2);
    expect(timeButtons[0].nativeElement.textContent.trim()).toBe('10:00');
    expect(timeButtons[1].nativeElement.textContent.trim()).toBe('11:00');
  });

  it('should handle the full booking flow successfully', fakeAsync(() => {
    fixture.detectChanges();

    // 1. Simula que o usuário confirma o diálogo
    mockConfirmService.confirm.and.returnValue(of(true));

    // 2. Simula uma resposta de sucesso da API de criação
    const mockNewAppointment = {id: 123, start_time: '2025-10-06 10:00:00'} as any;
    mockProfessionalService.createAppointment.and.returnValue(of(mockNewAppointment));

    // 3. Encontra e clica no primeiro botão de horário
    const timeButton = fixture.debugElement.query(By.css('button.border-sky-500'));
    timeButton.nativeElement.click();

    // 4. Aguarda a resolução das promessas e observables
    tick();

    // 5. Assert: Verifica se os serviços foram chamados corretamente
    expect(mockConfirmService.confirm).toHaveBeenCalled();
    expect(mockProfessionalService.createAppointment).toHaveBeenCalled();
    expect(mockToastService.show).toHaveBeenCalledWith(
      `Agendamento realizado com sucesso para ${new Date(mockNewAppointment.start_time)
        .toLocaleString('pt-BR')}`,
      'success',
    );
  }));
  //
  it('should show an error toast if booking fails', fakeAsync(() => {
    // Arrange
    fixture.detectChanges();
    mockConfirmService.confirm.and.returnValue(of(true));

    // Act
    const errorResponse = {error: {error: 'Horário indisponível.'}};
    const error$ = new Subject();
    mockProfessionalService.createAppointment.and.returnValue(error$.asObservable() as any);

    const timeButton = fixture.debugElement.query(By.css('button.border-sky-500'));
    timeButton.nativeElement.click();
    tick();

    error$.error(errorResponse);
    tick();

    // Assert
    expect(mockToastService.show).toHaveBeenCalledWith('Erro ao agendar: undefined', 'error');
  }));
});
