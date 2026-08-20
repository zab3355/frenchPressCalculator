import { TestBed } from '@angular/core/testing';
import { COCKTAIL_RECIPES, CocktailRecipe } from '../data/cocktails.data';
import { CocktailScalingService } from './cocktail-scaling.service';

describe('CocktailScalingService', () => {
  let service: CocktailScalingService;

  const recipe: CocktailRecipe = {
    id: 'test-recipe',
    name: 'Test Recipe',
    ingredients: [
      { name: 'Spirit', amount: 2, unit: 'oz' },
      { name: 'Bitters', amount: 2, unit: 'dash' },
    ],
    garnish: 'Twist',
    instructions: 'Stir and strain.',
    glassType: 'rocks',
    method: 'stir',
    liquidColor: '#c17a3a',
    garnishShape: 'twist',
    garnishColor: '#e8a33d',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CocktailScalingService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('returns unscaled amounts for 1 serving', () => {
    const result = service.scale(recipe, 1);

    expect(result[0].amount).toBe(2);
    expect(result[1].amount).toBe(2);
  });

  it('scales all ingredient amounts proportionally', () => {
    const result = service.scale(recipe, 4);

    expect(result[0].amount).toBe(8);
    expect(result[1].amount).toBe(8);
  });

  it('does not mutate the source recipe', () => {
    service.scale(recipe, 4);

    expect(recipe.ingredients[0].amount).toBe(2);
  });

  it('preserves ingredient name and unit', () => {
    const result = service.scale(recipe, 3);

    expect(result[0].name).toBe('Spirit');
    expect(result[0].unit).toBe('oz');
  });

  it('throws for zero servings', () => {
    expect(() => service.scale(recipe, 0)).toThrowError(
      'Servings must be a positive whole number.'
    );
  });

  it('throws for negative servings', () => {
    expect(() => service.scale(recipe, -1)).toThrowError(
      'Servings must be a positive whole number.'
    );
  });

  it('throws for non-integer servings', () => {
    expect(() => service.scale(recipe, 2.5)).toThrowError(
      'Servings must be a positive whole number.'
    );
  });

  it('has 8 defined recipes with unique ids', () => {
    expect(COCKTAIL_RECIPES.length).toBe(8);
    expect(new Set(COCKTAIL_RECIPES.map((r) => r.id)).size).toBe(8);
  });
});
