import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../auth/auth.service';
import { EventTrackingService } from './event-tracking.service';

describe('EventTrackingService', () => {
  let service: EventTrackingService;
  let authService: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(EventTrackingService);
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    document.cookie = 'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  });

  it('does not call the API when no user is logged in', () => {
    authService.currentUser.set(null);

    service.record('french-press', 'VIEW');

    httpMock.expectNone('/api/events');
  });

  it('posts drinkType and eventType with a CSRF header when a user is logged in', () => {
    document.cookie = 'XSRF-TOKEN=test-token';
    authService.currentUser.set({ id: 1, email: 'a@example.com', displayName: 'Ada' });

    service.record('espresso', 'CALCULATE');

    const req = httpMock.expectOne('/api/events');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ drinkType: 'espresso', eventType: 'CALCULATE' });
    expect(req.request.headers.get('X-XSRF-TOKEN')).toBe('test-token');
    req.flush(null);
  });

  it('swallows errors from the tracking call without throwing', () => {
    authService.currentUser.set({ id: 1, email: 'a@example.com', displayName: 'Ada' });

    expect(() => {
      service.record('matcha', 'VIEW');
      const req = httpMock.expectOne('/api/events');
      req.flush('boom', { status: 500, statusText: 'Server Error' });
    }).not.toThrow();
  });
});
