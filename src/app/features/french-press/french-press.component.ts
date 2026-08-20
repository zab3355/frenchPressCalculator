import { Component, computed, inject, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  BrewCalculation,
  FrenchPressCalculatorService,
} from '../../core/calculator/french-press-calculator.service';
import { ValidationMessageService } from '../../core/services/validation-message.service';
import { formatDecimal } from '../../core/utils/number-formatter';
import { PulseOnChangeDirective } from '../../shared/pulse-on-change/pulse-on-change.directive';
import { ScrollRevealDirective } from '../../shared/scroll-reveal/scroll-reveal.directive';

@Component({
  selector: 'app-french-press',
  standalone: true,
  imports: [ReactiveFormsModule, ScrollRevealDirective, PulseOnChangeDirective],
  templateUrl: './french-press.component.html',
})
export class FrenchPressComponent {
  private readonly calculator = inject(FrenchPressCalculatorService);
  private readonly validationService = inject(ValidationMessageService);

  readonly gramsPerCup = this.calculator.gramsPerCup;
  readonly cupMilliliters = this.calculator.cupMilliliters;
  readonly minCups = 0.25;
  readonly maxCups = 6;
  readonly minGrams = this.minCups * this.gramsPerCup;
  readonly maxGrams = this.maxCups * this.gramsPerCup;

  readonly coffeeInput = new FormControl<number | null>(45, {
    validators: [Validators.required, Validators.min(this.minGrams), Validators.max(this.maxGrams)],
  });

  readonly hasInteracted = signal(false);
  readonly calculation = signal<BrewCalculation | null>(this.calculator.calculate(45));
  readonly fillPercent = computed(() => {
    const cups = this.calculation()?.cups ?? 0;
    return Math.max(8, Math.min(95, (cups / 6) * 100));
  });

  readonly displayCups = computed(() => formatDecimal(this.calculation()?.cups));
  readonly displayLiters = computed(() => formatDecimal(this.calculation()?.liters));

  /**
   * FormControl.value/.errors/.invalid/.dirty are plain properties, not
   * signals — reading them inside computed() registers no dependency, so a
   * computed reading only those would compute once and cache forever.
   * This bridges the control's (synchronous validators) value into the
   * signal graph so computeds below actually recompute on user input.
   */
  private readonly coffeeInputChanges: Signal<number | null>;

  readonly displayGrams = computed(() => formatDecimal(this.calculation()?.coffeeGrams));

  readonly validationMessage = computed(() => {
    this.coffeeInputChanges();

    if (!this.shouldShowErrors()) {
      return '';
    }

    return this.validationService.getValidationMessage(this.coffeeInput.errors, {
      requiredMessage: 'Add how many grams of coffee you have.',
      minMessage: `Use at least ${this.minGrams.toFixed(2)}g for about ${this.minCups} cup.`,
      maxMessage: `This french press holds up to ${this.maxCups} cups. Use ${Math.floor(this.maxGrams)}g or less.`,
    });
  });

  constructor() {
    this.coffeeInputChanges = toSignal(this.coffeeInput.valueChanges, {
      initialValue: this.coffeeInput.value,
    });
  }

  onSubmit(): void {
    this.hasInteracted.set(true);
    this.tryCalculate();
  }

  setQuickAmount(grams: number): void {
    this.coffeeInput.setValue(grams);
    this.hasInteracted.set(true);
    this.tryCalculate();
  }

  shouldShowErrors(): boolean {
    return this.coffeeInput.invalid && (this.coffeeInput.dirty || this.hasInteracted());
  }

  private tryCalculate(): void {
    const grams = this.coffeeInput.value;

    if (grams === null || this.coffeeInput.invalid) {
      this.calculation.set(null);
      return;
    }

    this.calculation.set(this.calculator.calculate(grams));
  }
}
