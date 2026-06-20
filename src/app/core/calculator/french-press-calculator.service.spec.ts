import { TestBed } from '@angular/core/testing';
import { FrenchPressCalculatorService } from './french-press-calculator.service';

describe('FrenchPressCalculatorService', () => {
  let service: FrenchPressCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrenchPressCalculatorService);
  });

  describe('calculate', () => {
    it('should create the service', () => {
      expect(service).toBeTruthy();
    });

    it('calculates 45 grams to 3 cups and about 0.71 liters', () => {
      const result = service.calculate(45);

      expect(result.coffeeGrams).toBe(45);
      expect(result.cups).toBe(3);
      expect(result.liters).toBeCloseTo(0.709764, 5);
    });

    it('handles minimum brew amount (0.25 cups)', () => {
      // 0.25 cups * 15g per cup = 3.75g
      const result = service.calculate(3.75);

      expect(result.cups).toBe(0.25);
      expect(result.liters).toBeCloseTo(0.059147, 5);
    });

    it('handles maximum brew amount (6 cups)', () => {
      // 6 cups * 15g per cup = 90g
      const result = service.calculate(90);

      expect(result.cups).toBe(6);
      expect(result.liters).toBeCloseTo(1.419528, 5);
    });

    it('handles fractional coffee amounts', () => {
      const result = service.calculate(22.5);

      expect(result.cups).toBe(1.5);
      expect(result.liters).toBeCloseTo(0.354882, 5);
    });

    it('handles very small amounts', () => {
      const result = service.calculate(0.1);

      expect(result.cups).toBeCloseTo(0.00667, 5);
      expect(result.liters).toBeCloseTo(0.001577, 5);
    });

    it('maintains precision with large amounts', () => {
      const result = service.calculate(150);

      expect(result.cups).toBe(10);
      expect(result.liters).toBeCloseTo(2.36588, 5);
    });
  });

  describe('validation', () => {
    it('throws error for zero grams', () => {
      expect(() => service.calculate(0)).toThrowError('Coffee grams must be greater than 0.');
    });

    it('throws error for negative grams', () => {
      expect(() => service.calculate(-10)).toThrowError('Coffee grams must be greater than 0.');
    });

    it('throws error for NaN', () => {
      expect(() => service.calculate(NaN)).toThrowError('Coffee grams must be greater than 0.');
    });

    it('throws error for Infinity', () => {
      expect(() => service.calculate(Infinity)).toThrowError(
        'Coffee grams must be greater than 0.'
      );
    });

    it('throws error for negative Infinity', () => {
      expect(() => service.calculate(-Infinity)).toThrowError(
        'Coffee grams must be greater than 0.'
      );
    });
  });

  describe('constants', () => {
    it('has correct grams per cup constant', () => {
      expect(service.gramsPerCup).toBe(15);
    });

    it('has correct cup milliliters constant', () => {
      expect(service.cupMilliliters).toBe(236.588);
    });
  });
});
