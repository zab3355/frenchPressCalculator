import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  describe('initialization', () => {
    it('should create the app', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      expect(app).toBeTruthy();
    });

    it('initializes with 45g as default coffee amount', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      expect(app.coffeeInput.value).toBe(45);
      expect(app.hasInteracted()).toBe(false);
    });

    it('initializes with default calculation (3 cups)', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      expect(app.calculation()?.cups).toBe(3);
    });
  });

  describe('calculation display', () => {
    it('shows 3.00 cups for the default 45 grams', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const cups = compiled.querySelector('[data-testid="cups-value"]')?.textContent?.trim();
      expect(cups).toBe('3.00');
    });

    it('shows 0.71 liters for the default 45 grams', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const liters = compiled.querySelector('[data-testid="liters-value"]')?.textContent?.trim();
      expect(liters).toBe('0.71');
    });

    it('displays formatted display grams correctly', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      fixture.detectChanges();

      expect(app.displayGrams()).toBe('45.00');
    });

    it('updates display when coffee amount changes', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      app.coffeeInput.setValue(60);
      fixture.detectChanges();

      expect(app.displayCups()).toBe('4.00');
      const litersValue = Number.parseFloat(app.displayLiters());
      expect(litersValue).toBeCloseTo(0.95, 1);
    });

    it('shows 0.00 when calculation is null', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      app.calculation.set(null);
      fixture.detectChanges();

      expect(app.displayCups()).toBe('0.00');
      expect(app.displayLiters()).toBe('0.00');
    });
  });

  describe('form validation', () => {
    it('form is valid with default 45g', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      expect(app.coffeeInput.valid).toBe(true);
    });

    it('shows no validation message initially', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      fixture.detectChanges();

      expect(app.validationMessage()).toBe('');
    });

    it('marks form as invalid when value is null', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      app.coffeeInput.setValue(null);
      expect(app.coffeeInput.invalid).toBe(true);
    });

    it('shows required message when amount is empty after interaction', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      app.coffeeInput.setValue(null);
      app.onSubmit();
      fixture.detectChanges();

      expect(app.validationMessage()).toContain('Add how many grams of coffee you have');
    });

    it('shows min error when grams below minimum (3.75g = 0.25 cups)', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      app.coffeeInput.setValue(3);
      app.onSubmit();
      fixture.detectChanges();

      expect(app.validationMessage()).toContain('Use at least');
    });

    it('shows max error when grams exceed maximum (90g = 6 cups)', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      app.coffeeInput.setValue(100);
      app.onSubmit();
      fixture.detectChanges();

      expect(app.validationMessage()).toContain('french press holds up to');
    });

    it('does not show errors if form is invalid but user has not interacted', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      app.coffeeInput.setValue(null);
      fixture.detectChanges();

      expect(app.shouldShowErrors()).toBe(false);
      expect(app.validationMessage()).toBe('');
    });
  });

  describe('user interactions', () => {
    it('sets hasInteracted when form is submitted', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      expect(app.hasInteracted()).toBe(false);
      app.onSubmit();
      expect(app.hasInteracted()).toBe(true);
    });

    it('updates hasInteracted when quick amount button is clicked', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      app.setQuickAmount(30);
      expect(app.hasInteracted()).toBe(true);
      expect(app.coffeeInput.value).toBe(30);
    });

    it('calculates correct result when quick amount is set', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      app.setQuickAmount(30);
      fixture.detectChanges();

      expect(app.displayCups()).toBe('2.00');
    });

    it('processes each quick amount preset correctly', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      fixture.detectChanges();

      // Test 30g button
      app.setQuickAmount(30);
      expect(app.displayCups()).toBe('2.00');

      // Test 45g button
      app.setQuickAmount(45);
      expect(app.displayCups()).toBe('3.00');

      // Test 60g button
      app.setQuickAmount(60);
      expect(app.displayCups()).toBe('4.00');
    });

    it('calculates correctly when user types custom value', (done) => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      app.coffeeInput.setValue(75);
      // Subscription triggers after value change
      setTimeout(() => {
        fixture.detectChanges();
        expect(app.displayCups()).toBe('5.00');
        done();
      }, 50);
    });
  });

  describe('fill percent computation', () => {
    it('constrains fill percent between 8% and 95%', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      // Test minimum constraint (empty press)
      app.calculation.set(null);
      expect(app.fillPercent()).toBe(8);

      // Test normal fill
      app.setQuickAmount(45);
      expect(app.fillPercent()).toBeCloseTo(50, 0);

      // Test maximum constraint (overfilled)
      app.setQuickAmount(90);
      expect(app.fillPercent()).toBe(95);
    });

    it('scales fill percent proportionally to cup amount', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      // 3 cups (default) should be around 50%
      app.setQuickAmount(45);
      const fillAt3Cups = app.fillPercent();

      // 6 cups should be around 95% (max)
      app.setQuickAmount(90);
      const fillAt6Cups = app.fillPercent();

      expect(fillAt6Cups).toBeGreaterThan(fillAt3Cups);
    });
  });

  describe('shouldShowErrors', () => {
    it('returns false when form is valid', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      expect(app.shouldShowErrors()).toBe(false);
    });

    it('returns true when form is invalid and has been interacted with', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      app.coffeeInput.setValue(null);
      app.hasInteracted.set(true);

      expect(app.shouldShowErrors()).toBe(true);
    });

    it('returns true when form is invalid and marked dirty', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      app.coffeeInput.setValue(null);
      app.coffeeInput.markAsDirty();

      expect(app.shouldShowErrors()).toBe(true);
    });

    it('returns false when form is invalid but not dirty or interacted', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      app.coffeeInput.setValue(null);
      expect(app.coffeeInput.dirty).toBe(false);
      expect(app.hasInteracted()).toBe(false);

      expect(app.shouldShowErrors()).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles very small coffee amounts', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      app.coffeeInput.setValue(0.5);
      app.onSubmit();
      fixture.detectChanges();

      expect(app.calculation()).toBeTruthy();
      expect(app.displayCups()).toBeTruthy();
    });

    it('handles large coffee amounts within max bounds', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      app.coffeeInput.setValue(89);
      app.onSubmit();
      fixture.detectChanges();

      expect(app.calculation()).toBeTruthy();
      expect(Number.parseFloat(app.displayCups())).toBeLessThanOrEqual(6);
    });

    it('clears calculation when input is invalid', () => {
      const fixture = TestBed.createComponent(AppComponent);
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
