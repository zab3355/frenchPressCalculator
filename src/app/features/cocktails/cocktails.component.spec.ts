import { TestBed } from '@angular/core/testing';
import { CocktailsComponent } from './cocktails.component';

describe('CocktailsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CocktailsComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(CocktailsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('initializes with the first recipe at 1 serving', () => {
    const fixture = TestBed.createComponent(CocktailsComponent);
    const app = fixture.componentInstance;

    expect(app.selectedRecipe().id).toBe('old-fashioned');
    expect(app.scaledIngredients()?.[0].amount).toBe(2);
  });

  it('scales ingredient amounts with servings', () => {
    const fixture = TestBed.createComponent(CocktailsComponent);
    const app = fixture.componentInstance;

    app.setQuickServings(4);
    expect(app.scaledIngredients()?.[0].amount).toBe(8);
  });

  it('switches recipes and recalculates', () => {
    const fixture = TestBed.createComponent(CocktailsComponent);
    const app = fixture.componentInstance;

    app.recipeInput.setValue('margarita');
    expect(app.selectedRecipe().name).toBe('Margarita');
    expect(app.scaledIngredients()?.[0].amount).toBe(2);
  });

  it('shows required message when servings is empty after interaction', () => {
    const fixture = TestBed.createComponent(CocktailsComponent);
    const app = fixture.componentInstance;

    app.servingsInput.setValue(null);
    app.onSubmit();
    fixture.detectChanges();

    expect(app.validationMessage()).toContain('Add how many servings');
  });

  it('shows invalid message for a non-integer serving count', () => {
    const fixture = TestBed.createComponent(CocktailsComponent);
    const app = fixture.componentInstance;

    app.servingsInput.setValue(2.5);
    app.onSubmit();
    fixture.detectChanges();

    expect(app.validationMessage()).toContain('whole number');
  });

  it('shows max message above 12 servings', () => {
    const fixture = TestBed.createComponent(CocktailsComponent);
    const app = fixture.componentInstance;

    app.servingsInput.setValue(13);
    app.onSubmit();
    fixture.detectChanges();

    expect(app.validationMessage()).toContain('up to 12 servings');
  });

  it('renders the scaled ingredient list in the DOM', () => {
    const fixture = TestBed.createComponent(CocktailsComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const list = compiled.querySelector('[data-testid="ingredient-list"]');
    expect(list?.children.length).toBe(3);
  });
});
