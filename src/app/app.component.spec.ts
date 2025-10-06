import {TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'barberguide-frontend' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('barberguide-frontend');
  });

  it('should render the main title, confirm component and toast component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    // Verifica se o H1 existe
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, barberguide-frontend');
    // Verifica se os seletores dos nossos componentes globais foram renderizados
    expect(compiled.querySelector('app-confirm')).not.toBeNull();
    expect(compiled.querySelector('app-toast')).not.toBeNull();
  });
});
