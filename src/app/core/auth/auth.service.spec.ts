import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  function setup(platform: 'browser' | 'server') {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: platform },
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  }

  beforeEach(() => setup('browser'));

  afterEach(() => {
    httpMock.verify();
    document.cookie = 'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  });

  it('starts with currentUser undefined before init()', () => {
    expect(service.currentUser()).toBeUndefined();
  });

  it('sets currentUser from GET /api/me on init() when logged in', () => {
    service.init();

    const req = httpMock.expectOne('/api/me');
    expect(req.request.withCredentials).toBe(true);
    req.flush({ id: 1, email: 'a@example.com', displayName: 'Ada' });

    expect(service.currentUser()).toEqual({ id: 1, email: 'a@example.com', displayName: 'Ada' });
  });

  it('sets currentUser to null on init() when GET /api/me returns 401', () => {
    service.init();

    const req = httpMock.expectOne('/api/me');
    req.flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(service.currentUser()).toBeNull();
  });

  it('does not call the API on init() when not running in a browser', () => {
    TestBed.resetTestingModule();
    setup('server');

    service.init();

    httpMock.expectNone('/api/me');
    expect(service.currentUser()).toBeNull();
  });

  it('login() navigates to the Google OAuth endpoint', () => {
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', { writable: true, value: { href: '' } });

    service.login();

    expect(window.location.href).toBe('/oauth2/authorization/google');

    Object.defineProperty(window, 'location', { writable: true, value: originalLocation });
  });

  it('logout() posts to /api/auth/logout with the CSRF header and clears currentUser', () => {
    document.cookie = 'XSRF-TOKEN=test-token';
    service.currentUser.set({ id: 1, email: 'a@example.com', displayName: 'Ada' });

    service.logout();

    const req = httpMock.expectOne('/api/auth/logout');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('X-XSRF-TOKEN')).toBe('test-token');
    req.flush(null);

    expect(service.currentUser()).toBeNull();
  });
});
