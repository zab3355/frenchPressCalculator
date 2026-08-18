import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  EspressoCalculation,
  EspressoCalculatorService,
  EspressoRatioStyle,
} from '../../core/calculator/espresso-calculator.service';
import { ValidationMessageService } from '../../core/services/validation-message.service';
import { formatDecimal } from '../../core/utils/number-formatter';
import { ScrollRevealDirective } from '../../shared/scroll-reveal/scroll-reveal.directive';

@Component({
  selector: 'app-espresso',
  standalone: true,
  imports: [ReactiveFormsModule, ScrollRevealDirective],
  templateUrl: './espresso.component.html',
})
export class EspressoComponent {
  private readonly calculator = inject(EspressoCalculatorService);
  private readonly validationService = inject(ValidationMessageService);

  readonly minDose = 7;
  readonly maxDose = 20;

  readonly doseInput = new FormControl<number | null>(18, {
    validators: [Validators.required, Validators.min(this.minDose), Validators.max(this.maxDose)],
  });
  readonly ratioInput = new FormControl<EspressoRatioStyle>('normale', { nonNullable: true });

  readonly hasInteracted = signal(false);
  readonly calculation = signal<EspressoCalculation | null>(
    this.calculator.calculate(18, 'normale')
  );

  readonly displayYield = computed(() => formatDecimal(this.calculation()?.yieldGrams));

  readonly validationMessage = computed(() => {
    if (!this.shouldShowErrors()) {
      return '';
    }

    return this.validationService.getValidationMessage(this.doseInput.errors, {
      requiredMessage: 'Add how many grams of coffee you are dosing.',
      minMessage: `Use at least ${this.minDose}g for a reliable shot.`,
      maxMessage: `Keep the dose at ${this.maxDose}g or less for a standard basket.`,
    });
  });

  constructor() {
    this.ratioInput.valueChanges.subscribe(() => this.tryCalculate());
  }

  onSubmit(): void {
    this.hasInteracted.set(true);
    this.tryCalculate();
  }

  setQuickDose(doseGrams: number): void {
    this.doseInput.setValue(doseGrams);
    this.hasInteracted.set(true);
    this.tryCalculate();
  }

  shouldShowErrors(): boolean {
    return this.doseInput.invalid && (this.doseInput.dirty || this.hasInteracted());
  }

  private tryCalculate(): void {
    const dose = this.doseInput.value;

    if (dose === null || this.doseInput.invalid) {
      this.calculation.set(null);
      return;
    }

    this.calculation.set(this.calculator.calculate(dose, this.ratioInput.value));
  }
}
