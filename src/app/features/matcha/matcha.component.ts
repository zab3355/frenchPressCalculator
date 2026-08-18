import { Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  MatchaCalculation,
  MatchaCalculatorService,
  MatchaStyle,
} from '../../core/calculator/matcha-calculator.service';
import { ValidationMessageService } from '../../core/services/validation-message.service';
import { formatDecimal } from '../../core/utils/number-formatter';

function integerValidator(control: AbstractControl): ValidationErrors | null {
  return control.value === null || Number.isInteger(control.value) ? null : { integer: true };
}

@Component({
  selector: 'app-matcha',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './matcha.component.html',
})
export class MatchaComponent {
  private readonly calculator = inject(MatchaCalculatorService);
  private readonly validationService = inject(ValidationMessageService);

  readonly minServings = 1;
  readonly maxServings = 8;

  readonly servingsInput = new FormControl<number | null>(1, {
    validators: [
      Validators.required,
      Validators.min(this.minServings),
      Validators.max(this.maxServings),
      integerValidator,
    ],
  });
  readonly styleInput = new FormControl<MatchaStyle>('usucha', { nonNullable: true });

  readonly hasInteracted = signal(false);
  readonly calculation = signal<MatchaCalculation | null>(this.calculator.calculate(1, 'usucha'));

  readonly displayPowder = computed(() => formatDecimal(this.calculation()?.powderGrams));
  readonly displayWater = computed(() => formatDecimal(this.calculation()?.waterMl));

  readonly validationMessage = computed(() => {
    if (!this.shouldShowErrors()) {
      return '';
    }

    return this.validationService.getValidationMessage(this.servingsInput.errors, {
      requiredMessage: 'Add how many servings you want to make.',
      minMessage: `Make at least ${this.minServings} serving.`,
      maxMessage: `This calculator supports up to ${this.maxServings} servings.`,
      invalidMessage: 'Enter a whole number of servings.',
    });
  });

  constructor() {
    this.servingsInput.valueChanges.subscribe(() => this.tryCalculate());
    this.styleInput.valueChanges.subscribe(() => this.tryCalculate());
  }

  onSubmit(): void {
    this.hasInteracted.set(true);
    this.tryCalculate();
  }

  setQuickServings(servings: number): void {
    this.servingsInput.setValue(servings);
    this.hasInteracted.set(true);
  }

  shouldShowErrors(): boolean {
    return this.servingsInput.invalid && (this.servingsInput.dirty || this.hasInteracted());
  }

  private tryCalculate(): void {
    const servings = this.servingsInput.value;

    if (servings === null || this.servingsInput.invalid) {
      this.calculation.set(null);
      return;
    }

    this.calculation.set(this.calculator.calculate(servings, this.styleInput.value));
  }
}
