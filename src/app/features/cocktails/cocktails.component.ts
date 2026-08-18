import { Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CocktailScalingService } from '../../core/calculator/cocktail-scaling.service';
import {
  COCKTAIL_RECIPES,
  CocktailIngredient,
  CocktailRecipe,
} from '../../core/data/cocktails.data';
import { ValidationMessageService } from '../../core/services/validation-message.service';
import { formatDecimal } from '../../core/utils/number-formatter';

function integerValidator(control: AbstractControl): ValidationErrors | null {
  return control.value === null || Number.isInteger(control.value) ? null : { integer: true };
}

@Component({
  selector: 'app-cocktails',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cocktails.component.html',
})
export class CocktailsComponent {
  private readonly scalingService = inject(CocktailScalingService);
  private readonly validationService = inject(ValidationMessageService);

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

  readonly selectedRecipe = computed<CocktailRecipe>(() => {
    const recipe = this.recipes.find((r) => r.id === this.recipeInput.value);
    return recipe ?? this.recipes[0];
  });

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
