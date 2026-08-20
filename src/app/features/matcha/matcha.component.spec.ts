import { TestBed } from '@angular/core/testing';
import { MatchaComponent } from './matcha.component';

describe('MatchaComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchaComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(MatchaComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('initializes with 1 serving of usucha', () => {
    const fixture = TestBed.createComponent(MatchaComponent);
    const app = fixture.componentInstance;

    expect(app.servingsInput.value).toBe(1);
    expect(app.styleInput.value).toBe('usucha');
    expect(app.calculation()?.powderGrams).toBe(2);
    expect(app.calculation()?.waterMl).toBe(60);
  });

  it('scales usucha amounts with servings', () => {
    const fixture = TestBed.createComponent(MatchaComponent);
    const app = fixture.componentInstance;

    app.setQuickServings(4);
    expect(app.calculation()?.powderGrams).toBe(8);
    expect(app.calculation()?.waterMl).toBe(240);
  });

  it('switches to koicha ratios', () => {
    const fixture = TestBed.createComponent(MatchaComponent);
    const app = fixture.componentInstance;

    app.styleInput.setValue('koicha');
    expect(app.calculation()?.powderGrams).toBe(4);
    expect(app.calculation()?.waterMl).toBe(30);
  });

  it('shows required message when servings is empty after interaction', () => {
    const fixture = TestBed.createComponent(MatchaComponent);
    const app = fixture.componentInstance;

    app.servingsInput.setValue(null);
    app.onSubmit();
    fixture.detectChanges();

    expect(app.validationMessage()).toContain('Add how many servings');
  });

  it('shows invalid message for a non-integer serving count', () => {
    const fixture = TestBed.createComponent(MatchaComponent);
    const app = fixture.componentInstance;

    app.servingsInput.setValue(1.5);
    app.onSubmit();
    fixture.detectChanges();

    expect(app.validationMessage()).toContain('whole number');
    expect(app.calculation()).toBeNull();
  });

  it('shows max message above 8 servings', () => {
    const fixture = TestBed.createComponent(MatchaComponent);
    const app = fixture.componentInstance;

    app.servingsInput.setValue(9);
    app.onSubmit();
    fixture.detectChanges();

    expect(app.validationMessage()).toContain('up to 8 servings');
  });

  it('renders the calculated values in the DOM', () => {
    const fixture = TestBed.createComponent(MatchaComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[data-testid="powder-value"]')?.textContent).toContain('2.00');
    expect(compiled.querySelector('[data-testid="water-value"]')?.textContent).toContain('60.00');
  });
});
