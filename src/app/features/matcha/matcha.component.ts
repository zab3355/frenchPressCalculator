import { Component, computed, inject, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
import { PulseOnChangeDirective } from '../../shared/pulse-on-change/pulse-on-change.directive';
import { ScrollRevealDirective } from '../../shared/scroll-reveal/scroll-reveal.directive';

function integerValidator(control: AbstractControl): ValidationErrors | null {
  return control.value === null || Number.isInteger(control.value) ? null : { integer: true };
}

@Component({
  selector: 'app-matcha',
  standalone: true,
  imports: [ReactiveFormsModule, ScrollRevealDirective, PulseOnChangeDirective],
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
  readonly fillPercent = computed(() => {
    const servings = this.calculation()?.servings ?? 1;
    return Math.max(20, Math.min(85, (servings / this.maxServings) * 85));
  });

  /**
   * FormControl.errors/.invalid/.dirty are plain properties, not signals —
   * reading them inside computed() registers no dependency. This bridges
   * the control's (synchronous validators) value into the signal graph so
   * validationMessage actually recomputes on user input.
   */
  private readonly servingsInputChanges: Signal<number | null>;

  readonly validationMessage = computed(() => {
    this.servingsInputChanges();

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
    this.servingsInputChanges = toSignal(this.servingsInput.valueChanges, {
      initialValue: this.servingsInput.value,
    });
    this.styleInput.valueChanges.subscribe(() => this.tryCalculate());
  }

  onSubmit(): void {
    this.hasInteracted.set(true);
    this.tryCalculate();
  }

  setQuickServings(servings: number): void {
    this.servingsInput.setValue(servings);
    this.hasInteracted.set(true);
    this.tryCalculate();
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
