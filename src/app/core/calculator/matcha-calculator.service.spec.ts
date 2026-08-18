import { TestBed } from '@angular/core/testing';
import { MatchaCalculatorService } from './matcha-calculator.service';

describe('MatchaCalculatorService', () => {
  let service: MatchaCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchaCalculatorService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  describe('usucha', () => {
    it('calculates 1 serving as 2g powder and 60ml water', () => {
      const result = service.calculate(1, 'usucha');

      expect(result.powderGrams).toBe(2);
      expect(result.waterMl).toBe(60);
      expect(result.tempGuidance).toContain('80');
    });

    it('scales linearly with servings', () => {
      const result = service.calculate(4, 'usucha');

      expect(result.powderGrams).toBe(8);
      expect(result.waterMl).toBe(240);
    });
  });

  describe('koicha', () => {
    it('calculates 1 serving as 4g powder and 30ml water', () => {
      const result = service.calculate(1, 'koicha');

      expect(result.powderGrams).toBe(4);
      expect(result.waterMl).toBe(30);
      expect(result.tempGuidance).toContain('70');
    });

    it('scales linearly with servings', () => {
      const result = service.calculate(3, 'koicha');

      expect(result.powderGrams).toBe(12);
      expect(result.waterMl).toBe(90);
    });
  });

  describe('validation', () => {
    it('throws for zero servings', () => {
      expect(() => service.calculate(0, 'usucha')).toThrowError(
        'Servings must be a positive whole number.'
      );
    });

    it('throws for negative servings', () => {
      expect(() => service.calculate(-2, 'usucha')).toThrowError(
        'Servings must be a positive whole number.'
      );
    });

    it('throws for non-integer servings', () => {
      expect(() => service.calculate(1.5, 'usucha')).toThrowError(
        'Servings must be a positive whole number.'
      );
    });

    it('throws for NaN', () => {
      expect(() => service.calculate(NaN, 'usucha')).toThrowError(
        'Servings must be a positive whole number.'
      );
    });

    it('throws for Infinity', () => {
      expect(() => service.calculate(Infinity, 'usucha')).toThrowError(
        'Servings must be a positive whole number.'
      );
    });
  });
});
