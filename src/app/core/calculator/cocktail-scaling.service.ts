import { Injectable } from '@angular/core';
import { CocktailIngredient, CocktailRecipe } from '../data/cocktails.data';

/** Pure — never mutates the source recipe. */
@Injectable({ providedIn: 'root' })
export class CocktailScalingService {
  scale(recipe: CocktailRecipe, servings: number): CocktailIngredient[] {
    const safeServings = this.toSafeServings(servings);

    return recipe.ingredients.map((ingredient) => ({
      ...ingredient,
      amount: ingredient.amount * safeServings,
    }));
  }

  private toSafeServings(servings: number): number {
    if (!Number.isFinite(servings) || servings <= 0 || !Number.isInteger(servings)) {
      throw new Error('Servings must be a positive whole number.');
    }

    return servings;
  }
}
