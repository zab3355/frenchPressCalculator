import { TestBed } from '@angular/core/testing';
import { FrenchPressCalculatorService } from './french-press-calculator.service';

describe('FrenchPressCalculatorService', () => {
  let service: FrenchPressCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrenchPressCalculatorService);
  });

  it('maps 45 grams to 3 cups and about 0.71 liters', () => {
    const result = service.calculate(45);

    expect(result.cups).toBe(3);
    expect(result.liters).toBeCloseTo(0.709764, 6);
  });

  it('throws when grams are not positive', () => {
    expect(() => service.calculate(0)).toThrowError();
    expect(() => service.calculate(-1)).toThrowError();
  });
});
