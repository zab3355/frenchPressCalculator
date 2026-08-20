import { TestBed } from '@angular/core/testing';
import { FrenchPressComponent } from './french-press.component';

describe('FrenchPressComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrenchPressComponent],
    }).compileComponents();
  });

  describe('initialization', () => {
    it('should create the component', () => {
      const fixture = TestBed.createComponent(FrenchPressComponent);
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('initializes with 45g as default coffee amount', () => {
      const fixture = TestBed.createComponent(FrenchPressComponent);
      const app = fixture.componentInstance;

      expect(app.coffeeInput.value).toBe(45);
      expect(app.hasInteracted()).toBe(false);
    });

    it('initializes with default calculation (3 cups)', () => {
      const fixture = TestBed.createComponent(FrenchPressComponent);
      const app = fixture.componentInstance;

      expect(app.calculation()?.cups).toBe(3);
    });
  });

  describe('calculation display', () => {
    it('shows 3.00 cups for the default 45 grams', () => {
      const fixture = TestBed.createComponent(FrenchPressComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const cups = compiled.querySelector('[data-testid="cups-value"]')?.textContent?.trim();
      expect(cups).toBe('3.00');
    });

    it('shows 0.71 liters for the default 45 grams', () => {
      const fixture = TestBed.createComponent(FrenchPressComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const liters = compiled.querySelector('[data-testid="liters-value"]')?.textContent?.trim();
      expect(liters).toBe('0.71');
    });

    it('does not recalculate on keystroke alone', () => {
      const fixture = TestBed.createComponent(FrenchPressComponent);
      const app = fixture.componentInstance;

      app.coffeeInput.setValue(60);
      fixture.detectChanges();

      expect(app.displayCups()).toBe('3.00');
    });

    it('updates display when Calculate is submitted', () => {
      const fixture = TestBed.createComponent(FrenchPressComponent);
      const app = fixture.componentInstance;

      app.coffeeInput.setValue(60);
      app.onSubmit();
      fixture.detectChanges();

      expect(app.displayCups()).toBe('4.00');
    });

    it('shows 0.00 when calculation is null', () => {
      const fixture = TestBed.createComponent(FrenchPressComponent);
      const app = fixture.componentInstance;

      app.calculation.set(null);
      fixture.detectChanges();

      expect(app.displayCups()).toBe('0.00');
      expect(app.displayLiters()).toBe('0.00');
    });
  });

  describe('form validation', () => {
    it('form is valid with default 45g', () => {
      const fixture = TestBed.createComponent(FrenchPressComponent);
      const app = fixture.componentInstance;

      expect(app.coffeeInput.valid).toBe(true);
    });

    it('shows required message when amount is empty after interaction', () => {
      const fixture = TestBed.createComponent(FrenchPressComponent);
      const app = fixture.componentInstance;

      app.coffeeInput.setValue(null);
      app.onSubmit();
      fixture.detectChanges();

      expect(app.validationMessage()).toContain('Add how many grams of coffee you have');
    });

    it('shows min error when grams below minimum (3.75g = 0.25 cups)', () => {
      const fixture = TestBed.createComponent(FrenchPressComponent);
      const app = fixture.componentInstance;

      app.coffeeInput.setValue(3);
      app.onSubmit();
      fixture.detectChanges();

      expect(app.validationMessage()).toContain('Use at least');
    });

    it('shows max error when grams exceed maximum (90g = 6 cups)', () => {
      const fixture = TestBed.createComponent(FrenchPressComponent);
      const app = fixture.componentInstance;

      app.coffeeInput.setValue(100);
      app.onSubmit();
      fixture.detectChanges();

      expect(app.validationMessage()).toContain('french press holds up to');
    });

    it('does not show errors if form is invalid but user has not interacted', () => {
      const fixture = TestBed.createComponent(FrenchPressComponent);
      const app = fixture.componentInstance;

      app.coffeeInput.setValue(null);
      fixture.detectChanges();

      expect(app.shouldShowErrors()).toBe(false);
      expect(app.validationMessage()).toBe('');
    });
  });

  describe('user interactions', () => {
    it('sets hasInteracted when form is submitted', () => {
      const fixture = TestBed.createComponent(FrenchPressComponent);
      const app = fixture.componentInstance;

      expect(app.hasInteracted()).toBe(false);
      app.onSubmit();
      expect(app.hasInteracted()).toBe(true);
    });

    it('calculates correct result when quick amount is set', () => {
      const fixture = TestBed.createComponent(FrenchPressComponent);
      const app = fixture.componentInstance;

      app.setQuickAmount(30);
      fixture.detectChanges();

      expect(app.displayCups()).toBe('2.00');
    });
  });

  describe('fill percent computation', () => {
    it('constrains fill percent between 8% and 95%', () => {
      const fixture = TestBed.createComponent(FrenchPressComponent);
      const app = fixture.componentInstance;

      app.calculation.set(null);
      expect(app.fillPercent()).toBe(8);

      app.setQuickAmount(90);
      expect(app.fillPercent()).toBe(95);
    });
  });

  describe('edge cases', () => {
    it('clears calculation when input is invalid', () => {
      const fixture = TestBed.createComponent(FrenchPressComponent);
      const app = fixture.componentInstance;

      app.coffeeInput.setValue(45);
      app.onSubmit();
      expect(app.calculation()).toBeTruthy();

      app.coffeeInput.setValue(null);
      app.onSubmit();
      expect(app.calculation()).toBeNull();
    });
  });
});
