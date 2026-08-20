import { TestBed } from '@angular/core/testing';
import { EspressoCalculatorService } from './espresso-calculator.service';

describe('EspressoCalculatorService', () => {
  let service: EspressoCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspressoCalculatorService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  describe('normale (1:2)', () => {
    it('calculates 18g dose to 36g yield', () => {
      const result = service.calculate(18, 'normale');

      expect(result.yieldGrams).toBe(36);
      expect(result.shotTimeRange).toBe('25-30 seconds');
    });
  });

  describe('ristretto (1:1.5)', () => {
    it('calculates 18g dose to 27g yield', () => {
      const result = service.calculate(18, 'ristretto');

      expect(result.yieldGrams).toBe(27);
      expect(result.shotTimeRange).toBe('20-25 seconds');
    });
  });

  describe('lungo (1:3)', () => {
    it('calculates 18g dose to 54g yield', () => {
      const result = service.calculate(18, 'lungo');

      expect(result.yieldGrams).toBe(54);
      expect(result.shotTimeRange).toBe('30-40 seconds');
    });
  });

  describe('validation', () => {
    it('throws for zero dose', () => {
      expect(() => service.calculate(0, 'normale')).toThrowError(
        'Dose must be greater than 0 grams.'
      );
    });

    it('throws for negative dose', () => {
      expect(() => service.calculate(-5, 'normale')).toThrowError(
        'Dose must be greater than 0 grams.'
      );
    });

    it('throws for NaN', () => {
      expect(() => service.calculate(NaN, 'normale')).toThrowError(
        'Dose must be greater than 0 grams.'
      );
    });

    it('throws for Infinity', () => {
      expect(() => service.calculate(Infinity, 'normale')).toThrowError(
        'Dose must be greater than 0 grams.'
      );
    });

    it('allows fractional dose amounts', () => {
      const result = service.calculate(18.5, 'normale');
      expect(result.yieldGrams).toBe(37);
    });
  });
});
