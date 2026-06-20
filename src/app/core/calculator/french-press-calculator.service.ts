import { Injectable } from '@angular/core';

/**
 * Represents the result of a French press brew calculation.
 */
export interface BrewCalculation {
  /** Coffee grounds in grams */
  coffeeGrams: number;
  /** Calculated water volume in US cups */
  cups: number;
  /** Calculated water volume in liters */
  liters: number;
}

/**
 * Service for calculating water requirements for French press brewing.
 *
 * Implements a standard coffee-to-water ratio (15g coffee per 1 US cup).
 * Converts between grams (coffee input) and cups/liters (water output).
 *
 * @example
 * ```typescript
 * const service = inject(FrenchPressCalculatorService);
 * const result = service.calculate(45); // { coffeeGrams: 45, cups: 3, liters: ~0.71 }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class FrenchPressCalculatorService {
  /** Standard ratio: grams of coffee per 1 US cup of water */
  readonly gramsPerCup = 15;
  /** 1 US cup in milliliters */
  readonly cupMilliliters = 236.588;

  /**
   * Calculates required water volume based on coffee grams.
   *
   * @param coffeeGrams - Amount of coffee grounds in grams (must be > 0)
   * @returns BrewCalculation object with cups and liters
   * @throws Error if coffeeGrams is not a positive finite number
   *
   * @example
   * ```typescript
   * service.calculate(30);  // { coffeeGrams: 30, cups: 2, liters: ~0.473 }
   * service.calculate(45);  // { coffeeGrams: 45, cups: 3, liters: ~0.710 }
   * ```
   */
  calculate(coffeeGrams: number): BrewCalculation {
    const grams = this.toSafeNumber(coffeeGrams);
    const cups = grams / this.gramsPerCup;
    const liters = (cups * this.cupMilliliters) / 1000;

    return {
      coffeeGrams: grams,
      cups,
      liters,
    };
  }

  /**
   * Validates that a number is a positive finite value.
   * @private
   * @param value - Number to validate
   * @returns The validated number
   * @throws Error if value is not positive or not finite
   */
  private toSafeNumber(value: number): number {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error('Coffee grams must be greater than 0.');
    }

    return value;
  }
}
