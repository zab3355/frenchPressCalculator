import { TestBed } from '@angular/core/testing';
import { AgeGateService } from './age-gate.service';

describe('AgeGateService', () => {
  let service: AgeGateService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgeGateService);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('starts unverified when nothing is stored', () => {
    expect(service.status()).toBe('unverified');
  });

  it('confirm() sets status to confirmed and persists it', () => {
    service.confirm();

    expect(service.status()).toBe('confirmed');
    expect(sessionStorage.getItem('cocktails-age-gate')).toBe('confirmed');
  });

  it('deny() sets status to denied and persists it', () => {
    service.deny();

    expect(service.status()).toBe('denied');
    expect(sessionStorage.getItem('cocktails-age-gate')).toBe('denied');
  });

  it('reads a previously confirmed status from sessionStorage on construction', () => {
    sessionStorage.setItem('cocktails-age-gate', 'confirmed');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});

    const fresh = TestBed.inject(AgeGateService);

    expect(fresh.status()).toBe('confirmed');
  });

  it('reads a previously denied status from sessionStorage on construction', () => {
    sessionStorage.setItem('cocktails-age-gate', 'denied');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});

    const fresh = TestBed.inject(AgeGateService);

    expect(fresh.status()).toBe('denied');
  });
});
