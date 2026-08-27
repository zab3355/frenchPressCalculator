import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { AuthService } from './core/auth/auth.service';
import { ThemeService } from './core/theme/theme.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('initializes the theme service on creation', () => {
    const themeService = TestBed.inject(ThemeService);
    const initSpy = vi.spyOn(themeService, 'init');

    TestBed.createComponent(AppComponent);

    expect(initSpy).toHaveBeenCalled();
  });

  it('initializes the auth service on creation', () => {
    const authService = TestBed.inject(AuthService);
    const initSpy = vi.spyOn(authService, 'init');

    TestBed.createComponent(AppComponent);

    expect(initSpy).toHaveBeenCalled();
  });

  it('renders the navigation tabs and a router outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-navigation-tabs')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('renders the footer', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });
});
