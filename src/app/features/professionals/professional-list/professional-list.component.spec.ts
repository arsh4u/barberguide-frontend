import {ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import {ProfessionalListComponent} from './professional-list.component';
import {finalize, Observable, of, Subject, take} from 'rxjs';
import {User} from '../../../core/models/user.model';
import {ProfessionalService} from '../professional.service';
import {Store, StoreModule} from '@ngrx/store';
import {By} from '@angular/platform-browser';

fdescribe('ProfessionalListComponent', () => {
  let component: ProfessionalListComponent;
  let fixture: ComponentFixture<ProfessionalListComponent>;
  let mockProfessionalsService: jasmine.SpyObj<ProfessionalService>;

  beforeEach(async () => {
    // Cria um mock de serviço com o método getProfessionals()
    const professionalServiceSpy = jasmine.createSpyObj('ProfessionalService', ['getProfessionals']);

    await TestBed.configureTestingModule({
      imports: [ProfessionalListComponent, StoreModule.forRoot({})],
      providers: [
        {provide: ProfessionalService, useValue: professionalServiceSpy}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfessionalListComponent);
    component = fixture.componentInstance;
    mockProfessionalsService = TestBed.inject(ProfessionalService) as jasmine.SpyObj<ProfessionalService>;
    mockProfessionalsService.getProfessionals.and.returnValue(of([]));
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  // Teste de título correto
  fit('should have the correct title', () => {
    const title = fixture.nativeElement.querySelector('.title');
    expect(title.textContent).toBe('Nossos profissionais');
  });

  // Teste para o estado de carregamento
  fit('should display loading message initially and then show professionals', fakeAsync(() => {
    // Arrange
    const professionals$ = new Subject<User[]>();
    mockProfessionalsService.getProfessionals.and.returnValue(professionals$.asObservable());

    // Act & Assets (Loading State)
    fixture.detectChanges(); // Inicia o ngOnInit e loading = true

    expect(component.isLoading).toBeTrue();
    const loadingElement = fixture.debugElement.query(By.css('.loading-message'));
    expect(loadingElement).withContext('O loading deveria aparecer no início').not.toBeNull();
    expect(loadingElement.nativeElement.textContent).toContain('Carregando profissionais...');

    // Act (Simulate API Response)
    const mockProfessionals: User[] = [{id: 1, name: 'Dr. Barber', email: 'barber@gmail.com', role: 'profissional'}];
    professionals$.next(mockProfessionals);
    professionals$.complete();

    // Forçamos a inscrição no observable do componente, assim como o async pipe faria.
    component.professionals$.subscribe(() => {
      // Agora, verificamos se o card do profissional foi renderizado
      const professionalElement = fixture.debugElement.query(By.css('.professional-item'));
      expect(professionalElement).withContext('O card do profissional deveria aparecer').not.toBeNull();
      expect(professionalElement.nativeElement.textContent).toContain('Dr. Barber');
      expect(professionalElement.nativeElement.textContent).toContain('barber@gmail.com');
    });

    fixture.detectChanges(); // Atualiza o template com isLoading = false

    // Assert (Final State)
    const finalLoadingElement = fixture.debugElement.query(By.css('.loading-message'));
    expect(component.isLoading).toBeFalse();
    expect(finalLoadingElement).withContext('O loading deveria desaparecer no final').toBeNull();
  }));

  // Teste para o estado de "nenhum encontrado"
  it('should display "not found" message when API returns an empty array', () => {
    // Configura o mock para retornar um array vazio imediatamente
    mockProfessionalsService.getProfessionals.and.returnValue(of([]));

    fixture.detectChanges(); // Roda o ciclo de vida e a chamada de serviço

    const notFoundElement = fixture.debugElement.query(By.css('.not-found-message'));
    expect(notFoundElement).not.toBeNull();
    expect(notFoundElement.nativeElement.textContent).toContain('Nenhum profissional encontrado.');
  });
  // Teste de navegação para ProfessionalDetais
});
