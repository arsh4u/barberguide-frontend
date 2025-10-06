import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ProfessionalListComponent} from './professional-list.component';
import {of, Subject} from 'rxjs';
import {User} from '../../../core/models/user.model';
import {ProfessionalService} from '../professional.service';
import {provideStore} from '@ngrx/store';
import {By} from '@angular/platform-browser';
import {appRoutes} from '../../../app.routes';
import {provideRouter} from '@angular/router';
import {Location} from '@angular/common';
import {provideLocationMocks} from '@angular/common/testing';

describe('ProfessionalListComponent', () => {
  let component: ProfessionalListComponent;
  let fixture: ComponentFixture<ProfessionalListComponent>;
  let mockProfessionalsService: jasmine.SpyObj<ProfessionalService>;
  let location: Location;

  beforeEach(async () => {
    // Mock Service
    const professionalServiceSpy = jasmine.createSpyObj('ProfessionalService', ['getProfessionals']);

    await TestBed.configureTestingModule({
      imports: [ProfessionalListComponent],
      providers: [
        provideRouter(appRoutes),
        provideLocationMocks(),
        provideStore(),
        {provide: ProfessionalService, useValue: professionalServiceSpy},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfessionalListComponent);
    component = fixture.componentInstance;
    mockProfessionalsService = TestBed.inject(ProfessionalService) as jasmine.SpyObj<ProfessionalService>;
    location = TestBed.inject(Location);

    mockProfessionalsService.getProfessionals.and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Teste de título correto
  it('should have the correct title', () => {
    const title = fixture.nativeElement.querySelector('.title');
    expect(title.textContent).toBe('Nossos profissionais');
  });

  // Teste para o estado de carregamento
  it('should display loading message initially and then show professionals', () => {
    // Arrange
    const professionals$ = new Subject<User[]>();
    mockProfessionalsService.getProfessionals.and.returnValue(professionals$.asObservable());

    // Act &
    fixture.detectChanges();

    // Assert (Loading State)
    expect(component.isLoading).toBeTrue();
    const loadingElement = fixture.debugElement.query(By.css('.loading-message'));
    expect(loadingElement).withContext('O loading deveria aparecer no início').not.toBeNull();
    expect(loadingElement.nativeElement.textContent).toContain('Carregando profissionais...');

    // Act (Simulate API Response)
    const mockProfessionals: User[] = [{id: 1, name: 'Dr. Barber', email: 'barber@gmail.com', role: 'profissional'}];
    professionals$.next(mockProfessionals);
    professionals$.complete();

    fixture.detectChanges();

    // Assert (Professional)
    const professionalElement = fixture.debugElement.query(By.css('.professional-item'));
    expect(professionalElement).withContext('O card do profissional deveria aparecer').not.toBeNull();
    expect(professionalElement.nativeElement.textContent).toContain('Dr. Barber');
    expect(professionalElement.nativeElement.textContent).toContain('barber@gmail.com');

    // Assert (Loading State)
    const finalLoadingElement = fixture.debugElement.query(By.css('.loading-message'));
    expect(component.isLoading).toBeFalse();
    expect(finalLoadingElement).withContext('O loading deveria desaparecer no final').toBeNull();
  });

  // Teste para o estado de "nenhum encontrado"
  it('should display "not found" message when API returns an empty array', () => {
    // Arrange (Array empty)
    mockProfessionalsService.getProfessionals.and.returnValue(of([]));

    // Act
    fixture.detectChanges();

    // Assert
    const notFoundElement = fixture.debugElement.query(By.css('.not-found-message'));
    expect(notFoundElement).not.toBeNull();
    expect(notFoundElement.nativeElement.textContent).toContain('Nenhum profissional encontrado.');
  });

  it('should navigate to the correct professional detail page on card click', fakeAsync(() => {
    // Assert: Mock array one professional
    const mockProfessionals: User[] = [{id: 1, name: 'Dr. Barber', email: 'a@a.com', role: 'profissional'}];
    mockProfessionalsService.getProfessionals.and.returnValue(of(mockProfessionals));
    fixture.detectChanges();

    // Act: Encontra o card e simula o clique
    const cardElement = fixture.debugElement.query(By.css('.professional-item'));
    expect(cardElement).not.toBeNull(); // Garante que o card foi encontrado
    cardElement.nativeElement.click(); // Simula o clique do usuário

    tick(); // Await navigate async

    // Assert: Verifica se a URL no "navegador" do teste é a correta
    expect(location.path()).toBe('/professionals/1');
  }));

  it('should render the correct number of professional cards', fakeAsync(() => {
    // Arrange: Mock array with three professionals
    const mockProfessionals: User[] = [
      {id: 1, name: 'Profissional 1', email: 'a@g.com', role: 'profissional'},
      {id: 2, name: 'Profissional 2', email: 'b@g.com', role: 'profissional'},
      {id: 3, name: 'Profissional 3', email: 'c@g.com', role: 'profissional'},
    ];
    mockProfessionalsService.getProfessionals.and.returnValue(of(mockProfessionals));

    // Act: Renderiza o componente e aguarda a resolução do observable
    fixture.detectChanges();

    // Assert: Busca TODOS os elementos e verifica a contagem
    // Usamos o seletor de atributo que busca por "começa com" (^)
    const cardElements = fixture.debugElement.queryAll(By.css('.professional-item'));
    expect(cardElements.length).toBe(3); // Verifica se a quantidade de cards encontrados é igual a 3
  }));
});
