import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ThemeService } from './theme.service';

@Component({ selector: 'app-test-stub', standalone: true, template: '' })
class TestStubComponent {}

describe('ThemeService', () => {
  let service: ThemeService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: TestStubComponent, data: { theme: 'french-press' } },
          { path: 'matcha', component: TestStubComponent, data: { theme: 'matcha' } },
          { path: 'espresso', component: TestStubComponent, data: { theme: 'espresso' } },
          { path: 'cocktails', component: TestStubComponent, data: { theme: 'cocktails' } },
          { path: 'no-theme', component: TestStubComponent },
        ]),
      ],
    });

    service = TestBed.inject(ThemeService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    delete document.documentElement.dataset['theme'];
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('defaults to french-press before any navigation', () => {
    expect(service.currentTheme()).toBe('french-press');
  });

  it('applies the current route theme when init is called', async () => {
    await router.navigateByUrl('/matcha');
    service.init();

    expect(service.currentTheme()).toBe('matcha');
    expect(document.documentElement.dataset['theme']).toBe('matcha');
  });

  it('updates the theme on subsequent navigation', async () => {
    service.init();
    await router.navigateByUrl('/espresso');

    expect(service.currentTheme()).toBe('espresso');
    expect(document.documentElement.dataset['theme']).toBe('espresso');

    await router.navigateByUrl('/cocktails');

    expect(service.currentTheme()).toBe('cocktails');
    expect(document.documentElement.dataset['theme']).toBe('cocktails');
  });

  it('keeps the previous theme when a route has no theme data', async () => {
    service.init();
    await router.navigateByUrl('/matcha');
    await router.navigateByUrl('/no-theme');

    expect(service.currentTheme()).toBe('matcha');
  });
});
