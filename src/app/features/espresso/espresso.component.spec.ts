import { TestBed } from '@angular/core/testing';
import { EspressoComponent } from './espresso.component';

describe('EspressoComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspressoComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(EspressoComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('initializes with 18g dose and normale ratio', () => {
    const fixture = TestBed.createComponent(EspressoComponent);
    const app = fixture.componentInstance;

    expect(app.doseInput.value).toBe(18);
    expect(app.ratioInput.value).toBe('normale');
    expect(app.calculation()?.yieldGrams).toBe(36);
  });

  it('scales yield with dose', () => {
    const fixture = TestBed.createComponent(EspressoComponent);
    const app = fixture.componentInstance;

    app.setQuickDose(9);
    expect(app.calculation()?.yieldGrams).toBe(18);
  });

  it('switches to ristretto ratio', () => {
    const fixture = TestBed.createComponent(EspressoComponent);
    const app = fixture.componentInstance;

    app.ratioInput.setValue('ristretto');
    expect(app.calculation()?.yieldGrams).toBe(27);
    expect(app.calculation()?.shotTimeRange).toBe('20-25 seconds');
  });

  it('shows required message when dose is empty after interaction', () => {
    const fixture = TestBed.createComponent(EspressoComponent);
    const app = fixture.componentInstance;

    app.doseInput.setValue(null);
    app.onSubmit();
    fixture.detectChanges();

    expect(app.validationMessage()).toContain('Add how many grams');
  });

  it('shows min message below 7g', () => {
    const fixture = TestBed.createComponent(EspressoComponent);
    const app = fixture.componentInstance;

    app.doseInput.setValue(5);
    app.onSubmit();
    fixture.detectChanges();

    expect(app.validationMessage()).toContain('at least 7g');
  });

  it('shows max message above 20g', () => {
    const fixture = TestBed.createComponent(EspressoComponent);
    const app = fixture.componentInstance;

    app.doseInput.setValue(25);
    app.onSubmit();
    fixture.detectChanges();

    expect(app.validationMessage()).toContain('20g or less');
  });

  it('renders the calculated yield in the DOM', () => {
    const fixture = TestBed.createComponent(EspressoComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="yield-value"]')?.textContent).toContain('36.00');
  });
});
