import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    document.cookie = 'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  });

  it('getRecentEvents() GETs /api/events/recent with credentials', () => {
    service.getRecentEvents().subscribe();

    const req = httpMock.expectOne('/api/events/recent');
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);
    req.flush([]);
  });

  it('getSummary() GETs /api/events/summary with credentials', () => {
    service.getSummary().subscribe();

    const req = httpMock.expectOne('/api/events/summary');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('getPreferences() GETs /api/preferences with credentials', () => {
    service.getPreferences().subscribe();

    const req = httpMock.expectOne('/api/preferences');
    expect(req.request.method).toBe('GET');
    req.flush({ defaultDrinkType: 'french-press', units: 'metric' });
  });

  it('updatePreferences() PATCHes /api/preferences with a CSRF header', () => {
    document.cookie = 'XSRF-TOKEN=test-token';

    service.updatePreferences({ units: 'imperial' }).subscribe();

    const req = httpMock.expectOne('/api/preferences');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ units: 'imperial' });
    expect(req.request.headers.get('X-XSRF-TOKEN')).toBe('test-token');
    req.flush({ defaultDrinkType: 'french-press', units: 'imperial' });
  });
});
