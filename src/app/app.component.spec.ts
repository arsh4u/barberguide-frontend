import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {createComponent} from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent)
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it(`should have the 'barberguide-frontend' title`, () => {
    fixture.detectChanges();

    expect(component.title).toEqual('barberguide-frontend');
  });

  it('should render the main title, confirm component and toast component', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    // Verifica se o H1 existe
    expect(compiled.querySelector('h1')?.textContent).toContain('Sistema de Agendamento');
    // Verifica se os seletores dos nossos componentes globais foram renderizados
    expect(compiled.querySelector('app-confirm')).not.toBeNull();
    expect(compiled.querySelector('app-toast')).not.toBeNull();
  });
});
