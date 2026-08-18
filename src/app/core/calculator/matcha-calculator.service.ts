import { Injectable } from '@angular/core';

export type MatchaStyle = 'usucha' | 'koicha';

/** Result of a matcha powder/water calculation for a given number of servings. */
export interface MatchaCalculation {
  servings: number;
  style: MatchaStyle;
  powderGrams: number;
  waterMl: number;
  tempGuidance: string;
}

interface MatchaPreset {
  powderGramsPerServing: number;
  waterMlPerServing: number;
  tempGuidance: string;
}

const MATCHA_PRESETS: Record<MatchaStyle, MatchaPreset> = {
  usucha: {
    powderGramsPerServing: 2,
    waterMlPerServing: 60,
    tempGuidance: 'Whisk with water around 80°C (175°F).',
  },
  koicha: {
    powderGramsPerServing: 4,
    waterMlPerServing: 30,
    tempGuidance: 'Whisk with water around 70°C (160°F).',
  },
};

/**
 * Service for calculating matcha powder and water requirements.
 * Usucha (thin tea) and koicha (thick tea) use standard per-serving ratios.
 */
@Injectable({ providedIn: 'root' })
export class MatchaCalculatorService {
  calculate(servings: number, style: MatchaStyle): MatchaCalculation {
    const safeServings = this.toSafeServings(servings);
    const preset = MATCHA_PRESETS[style];

    return {
      servings: safeServings,
      style,
      powderGrams: safeServings * preset.powderGramsPerServing,
      waterMl: safeServings * preset.waterMlPerServing,
      tempGuidance: preset.tempGuidance,
    };
  }

  private toSafeServings(servings: number): number {
    if (!Number.isFinite(servings) || servings <= 0 || !Number.isInteger(servings)) {
      throw new Error('Servings must be a positive whole number.');
    }

    return servings;
  }
}
