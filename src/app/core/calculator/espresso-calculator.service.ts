import { Injectable } from '@angular/core';

export type EspressoRatioStyle = 'ristretto' | 'normale' | 'lungo';

export interface EspressoCalculation {
  doseGrams: number;
  ratioStyle: EspressoRatioStyle;
  yieldGrams: number;
  shotTimeRange: string;
}

interface EspressoPreset {
  ratio: number;
  shotTimeRange: string;
}

const ESPRESSO_PRESETS: Record<EspressoRatioStyle, EspressoPreset> = {
  ristretto: { ratio: 1.5, shotTimeRange: '20-25 seconds' },
  normale: { ratio: 2, shotTimeRange: '25-30 seconds' },
  lungo: { ratio: 3, shotTimeRange: '30-40 seconds' },
};

/** Ristretto, normale, and lungo use standard dose:yield ratios. */
@Injectable({ providedIn: 'root' })
export class EspressoCalculatorService {
  calculate(doseGrams: number, ratioStyle: EspressoRatioStyle): EspressoCalculation {
    const safeDose = this.toSafeDose(doseGrams);
    const preset = ESPRESSO_PRESETS[ratioStyle];

    return {
      doseGrams: safeDose,
      ratioStyle,
      yieldGrams: safeDose * preset.ratio,
      shotTimeRange: preset.shotTimeRange,
    };
  }

  private toSafeDose(doseGrams: number): number {
    if (!Number.isFinite(doseGrams) || doseGrams <= 0) {
      throw new Error('Dose must be greater than 0 grams.');
    }

    return doseGrams;
  }
}
