import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  BrewCalculation,
  FrenchPressCalculatorService,
} from './core/calculator/french-press-calculator.service';
import { ValidationMessageService } from './core/services/validation-message.service';
import { FooterComponent } from './shared/footer/footer.component';
import { formatDecimal } from './core/utils/number-formatter';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
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
  readonly displayGrams = computed(() => formatDecimal(this.coffeeInput.value));

  readonly validationMessage = computed(() => {
    if (!this.shouldShowErrors()) {
      return '';
    }

    return this.validationService.getValidationMessage(
      this.coffeeInput.errors,
      this.minGrams,
      this.maxGrams,
      this.minCups,
      this.maxCups
    );
  });

  constructor() {
    // Reactively update calculation when coffee input value changes
    this.coffeeInput.valueChanges.subscribe(() => {
      this.tryCalculate();
    });
  }

  onSubmit(): void {
    this.hasInteracted.set(true);
    this.tryCalculate();
  }

  setQuickAmount(grams: number): void {
    this.coffeeInput.setValue(grams);
    this.hasInteracted.set(true);
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
