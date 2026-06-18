import { Injectable } from '@angular/core';

export interface BrewCalculation {
  coffeeGrams: number;
  cups: number;
  liters: number;
}

@Injectable({ providedIn: 'root' })
export class FrenchPressCalculatorService {
  readonly gramsPerCup = 15;
  readonly cupMilliliters = 236.588;

  calculate(coffeeGrams: number): BrewCalculation {
    const grams = this.toSafeNumber(coffeeGrams);
    const cups = grams / this.gramsPerCup;
    const liters = (cups * this.cupMilliliters) / 1000;

    return {
      coffeeGrams: grams,
      cups,
      liters
    };
  }

  private toSafeNumber(value: number): number {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error('Coffee grams must be greater than 0.');
    }

    return value;
  }
}
