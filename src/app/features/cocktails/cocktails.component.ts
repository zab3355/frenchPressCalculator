import { Component, computed, ElementRef, inject, Signal, signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AgeGateService } from '../../core/age-gate/age-gate.service';
import { CocktailScalingService } from '../../core/calculator/cocktail-scaling.service';
import {
  COCKTAIL_RECIPES,
  CocktailIngredient,
  CocktailRecipe,
} from '../../core/data/cocktails.data';
import { ValidationMessageService } from '../../core/services/validation-message.service';
import { formatDecimal } from '../../core/utils/number-formatter';
import { AgeGateComponent } from '../../shared/age-gate/age-gate.component';
import { PulseOnChangeDirective } from '../../shared/pulse-on-change/pulse-on-change.directive';
import { ScrollRevealDirective } from '../../shared/scroll-reveal/scroll-reveal.directive';

function integerValidator(control: AbstractControl): ValidationErrors | null {
  return control.value === null || Number.isInteger(control.value) ? null : { integer: true };
}

@Component({
  selector: 'app-cocktails',
  standalone: true,
  imports: [ReactiveFormsModule, ScrollRevealDirective, AgeGateComponent, PulseOnChangeDirective],
  templateUrl: './cocktails.component.html',
})
export class CocktailsComponent {
  private readonly scalingService = inject(CocktailScalingService);
  private readonly validationService = inject(ValidationMessageService);
  readonly ageGate = inject(AgeGateService);

  @ViewChild('heading') private readonly headingRef?: ElementRef<HTMLElement>;

  readonly recipes = COCKTAIL_RECIPES;
  readonly minServings = 1;
  readonly maxServings = 12;

  readonly recipeInput = new FormControl<string>(this.recipes[0].id, { nonNullable: true });
  readonly servingsInput = new FormControl<number | null>(1, {
    validators: [
      Validators.required,
      Validators.min(this.minServings),
      Validators.max(this.maxServings),
      integerValidator,
    ],
  });

  readonly hasInteracted = signal(false);
  readonly scaledIngredients = signal<CocktailIngredient[] | null>(
    this.scalingService.scale(this.recipes[0], 1)
  );

  /**
   * FormControl.value/.errors/.invalid/.dirty are plain properties, not
   * signals — reading them inside computed() registers no dependency, so a
   * computed that only reads those would compute once and cache forever.
   * These bridge each control's synchronous (validators are all sync here)
   * value/validity into the signal graph so computeds below actually
   * recompute when the user changes the control.
   */
  private readonly recipeInputValue: Signal<string>;
  private readonly servingsInputChanges: Signal<number | null>;

  readonly selectedRecipe = computed<CocktailRecipe>(() => {
    const recipe = this.recipes.find((r) => r.id === this.recipeInputValue());
    return recipe ?? this.recipes[0];
  });

  readonly fillPercent = computed(() => {
    this.servingsInputChanges();
    const servings = this.scaledIngredients() ? (this.servingsInput.value ?? 1) : 1;
    return Math.max(30, Math.min(85, (servings / this.maxServings) * 85));
  });

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
    this.recipeInputValue = toSignal(this.recipeInput.valueChanges, {
      initialValue: this.recipeInput.value,
    });
    this.servingsInputChanges = toSignal(this.servingsInput.valueChanges, {
      initialValue: this.servingsInput.value,
    });
    this.recipeInput.valueChanges.subscribe(() => this.tryCalculate());
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

  onAgeConfirmed(): void {
    setTimeout(() => this.headingRef?.nativeElement.focus());
  }

  formatAmount(amount: number): string {
    return formatDecimal(amount, 2);
  }

  private tryCalculate(): void {
    const servings = this.servingsInput.value;

    if (servings === null || this.servingsInput.invalid) {
      this.scaledIngredients.set(null);
      return;
    }

    this.scaledIngredients.set(this.scalingService.scale(this.selectedRecipe(), servings));
  }
}
