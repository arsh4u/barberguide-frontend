import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ProfessionalListComponent} from './professional-list.component';
import {User} from '../../../core/models/user.model';
import {By} from '@angular/platform-browser';
import {appRoutes} from '../../../app.routes';
import {provideRouter} from '@angular/router';
import {Location} from '@angular/common';
import {provideLocationMocks} from '@angular/common/testing';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {
  ProfessionalsState,
  initialState,
  selectError,
  selectLoading,
  selectProfessionals
} from '../store/professionals.reducer';
import {ProfessionalsActions} from '../store/professionals.actions';


describe('ProfessionalListComponent', () => {
  let component: ProfessionalListComponent;
  let fixture: ComponentFixture<ProfessionalListComponent>;
  let store: MockStore<ProfessionalsState>;
  let location: Location;

  beforeEach(async () => {
    // Mock Service
    const professionalServiceSpy = jasmine.createSpyObj('ProfessionalService', ['getProfessionals']);

    await TestBed.configureTestingModule({
      imports: [ProfessionalListComponent],
      providers: [
        provideRouter(appRoutes),
        provideLocationMocks(),
        provideMockStore({initialState}),
        // {provide: ProfessionalService, useValue: professionalServiceSpy},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfessionalListComponent);
    component = fixture.componentInstance;
    // mockProfessionalsService = TestBed.inject(ProfessionalService) as jasmine.SpyObj<ProfessionalService>;
    store = TestBed.inject(MockStore);
    location = TestBed.inject(Location);

    spyOn(store, 'dispatch');

    fixture.detectChanges();

    // mockProfessionalsService.getProfessionals.and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Teste de título correto
  it('should have the correct title', () => {
    const title = fixture.nativeElement.querySelector('.title');
    expect(title.textContent).toBe('Nossos profissionais');
  });

  it('should dispatch LoadProfessionals action on init', () => {
    // Verifica se a ação correta foi despachada quando o componente iniciou
    expect(store.dispatch).toHaveBeenCalledWith(ProfessionalsActions.loadProfessionals());
  });

  it('should display professionals list when loading is false and data is available', () => {
    const mockProfessionals: User[] = [{ id: 1, name: 'Dr. Barber', email: 'a@a.com', role: 'profissional' }];
    // Atualiza o estado do Store para simular dados carregados
    store.overrideSelector(selectProfessionals, mockProfessionals);
    store.overrideSelector(selectLoading, false);
    store.refreshState();
    fixture.detectChanges();

    const professionalElement = fixture.debugElement.query(By.css('.professional-item'));
    expect(professionalElement).not.toBeNull();
    expect(professionalElement.nativeElement.textContent).toContain('Dr. Barber');
  });

  it('should display error message when an error occurs', () => {
    // Atualiza o estado do Store para simular um erro
    store.overrideSelector(selectError, { message: 'Failed to load' });
    store.overrideSelector(selectLoading, false);
    store.refreshState();
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('.text-red-500'));
    expect(errorElement).not.toBeNull();
    expect(errorElement.nativeElement.textContent).toContain('Ocorreu um erro');
  });


  // Teste para o estado de carregamento
  it('should display loading message initially and then show professionals', () => {
    // Arrange
    store.overrideSelector(selectProfessionals, []);
    store.overrideSelector(selectLoading, true);
    store.refreshState();

    // Act
    fixture.detectChanges();

    // Assert (Loading State)
    const loadingElement = fixture.debugElement.query(By.css('.loading-message'));
    expect(loadingElement).withContext('O loading deveria aparecer no início').not.toBeNull();
    expect(loadingElement.nativeElement.textContent).toContain('Carregando profissionais...');

    // Act (Simulate API Response)
    const mockProfessionals: User[] = [{id: 1, name: 'Dr. Barber', email: 'barber@gmail.com', role: 'profissional'}];
    store.overrideSelector(selectProfessionals, mockProfessionals);
    store.overrideSelector(selectLoading, false);
    store.refreshState();

    fixture.detectChanges();

    // Assert (Professional)
    const professionalElement = fixture.debugElement.query(By.css('.professional-item'));
    expect(professionalElement).withContext('O card do profissional deveria aparecer').not.toBeNull();
    expect(professionalElement.nativeElement.textContent).toContain('Dr. Barber');
    expect(professionalElement.nativeElement.textContent).toContain('barber@gmail.com');

    // Assert (Loading State)
    const finalLoadingElement = fixture.debugElement.query(By.css('.loading-message'));
    expect(finalLoadingElement).toBeNull();
    expect(finalLoadingElement).withContext('O loading deveria desaparecer no final').toBeNull();
  });

  // Teste para o estado de "nenhum encontrado"
  it('should display "not found" message when API returns an empty array', () => {
    // Arrange (Array empty)
    store.overrideSelector(selectProfessionals, []);
    store.refreshState();

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
    store.overrideSelector(selectProfessionals, mockProfessionals);
    store.refreshState();
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
    store.overrideSelector(selectProfessionals, mockProfessionals);
    store.refreshState();

    // Act: Renderiza o componente e aguarda a resolução do observable
    fixture.detectChanges();

    // Assert: Busca TODOS os elementos e verifica a contagem
    // Usamos o seletor de atributo que busca por "começa com" (^)
    const cardElements = fixture.debugElement.queryAll(By.css('.professional-item'));
    expect(cardElements.length).toBe(3); // Verifica se a quantidade de cards encontrados é igual a 3
  }));
});
