import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  BrewCalculation,
  FrenchPressCalculatorService
} from './core/calculator/french-press-calculator.service';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly calculator = inject(FrenchPressCalculatorService);

  readonly gramsPerCup = this.calculator.gramsPerCup;
  readonly cupMilliliters = this.calculator.cupMilliliters;
  readonly minCups = 0.25;
  readonly maxCups = 6;
  readonly minGrams = this.minCups * this.gramsPerCup;
  readonly maxGrams = this.maxCups * this.gramsPerCup;

  readonly coffeeInput = new FormControl<number | null>(45, {
    validators: [Validators.required, Validators.min(this.minGrams), Validators.max(this.maxGrams)]
  });

  readonly hasInteracted = signal(false);
  readonly calculation = signal<BrewCalculation | null>(this.calculator.calculate(45));
  readonly fillPercent = computed(() => {
    const cups = this.calculation()?.cups ?? 0;
    return Math.max(8, Math.min(95, (cups / 6) * 100));
  });

  readonly displayCups = computed(() => {
    const value = this.calculation()?.cups;
    return value === undefined ? '0.00' : value.toFixed(2);
  });

  readonly displayLiters = computed(() => {
    const value = this.calculation()?.liters;
    return value === undefined ? '0.00' : value.toFixed(2);
  });

  readonly displayGrams = computed(() => {
    const value = this.coffeeInput.value;
    if (value === null || Number.isNaN(value)) {
      return '0.00';
    }
    return value.toFixed(2);
  });

  readonly validationMessage = computed(() => {
    if (!this.shouldShowErrors()) {
      return '';
    }

    const errors = this.coffeeInput.errors;
    if (errors?.['required']) {
      return 'Add how many grams of coffee you have.';
    }
    if (errors?.['min']) {
      return `Use at least ${this.minGrams.toFixed(2)}g for about ${this.minCups} cup.`;
    }
    if (errors?.['max']) {
      return `This french press holds up to ${this.maxCups} cups. Use ${this.maxGrams.toFixed(0)}g or less.`;
    }

    return 'Enter a valid coffee amount.';
  });

  constructor() {
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
