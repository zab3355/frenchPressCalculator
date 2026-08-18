import { Component, computed, inject, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  EspressoCalculation,
  EspressoCalculatorService,
  EspressoRatioStyle,
} from '../../core/calculator/espresso-calculator.service';
import { ValidationMessageService } from '../../core/services/validation-message.service';
import { formatDecimal } from '../../core/utils/number-formatter';
import { PulseOnChangeDirective } from '../../shared/pulse-on-change/pulse-on-change.directive';
import { ScrollRevealDirective } from '../../shared/scroll-reveal/scroll-reveal.directive';

@Component({
  selector: 'app-espresso',
  standalone: true,
  imports: [ReactiveFormsModule, ScrollRevealDirective, PulseOnChangeDirective],
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
  readonly fillPercent = computed(() => {
    const yieldGrams = this.calculation()?.yieldGrams ?? 0;
    const maxYield = this.maxDose * 3;
    return Math.max(15, Math.min(90, (yieldGrams / maxYield) * 100));
  });

  /**
   * FormControl.errors/.invalid/.dirty are plain properties, not signals —
   * reading them inside computed() registers no dependency. This bridges
   * the control's (synchronous validators) value into the signal graph so
   * validationMessage actually recomputes on user input.
   */
  private readonly doseInputChanges: Signal<number | null>;

  readonly validationMessage = computed(() => {
    this.doseInputChanges();

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
    this.doseInputChanges = toSignal(this.doseInput.valueChanges, {
      initialValue: this.doseInput.value,
    });
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
