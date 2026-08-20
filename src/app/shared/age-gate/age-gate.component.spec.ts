import { TestBed } from '@angular/core/testing';
import { AgeGateComponent } from './age-gate.component';

describe('AgeGateComponent', () => {
  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [AgeGateComponent],
    }).compileComponents();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(AgeGateComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a modal dialog while unverified and focuses the confirm button', () => {
    const fixture = TestBed.createComponent(AgeGateComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const dialog = compiled.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
    expect(dialog?.getAttribute('aria-modal')).toBe('true');

    const confirmButton = compiled.querySelector('button');
    expect(document.activeElement).toBe(confirmButton);
  });

  it('confirm() marks the age gate confirmed and emits confirmed', () => {
    const fixture = TestBed.createComponent(AgeGateComponent);
    fixture.detectChanges();
    const confirmedSpy = vi.fn();
    fixture.componentInstance.confirmed.subscribe(confirmedSpy);

    fixture.componentInstance.confirm();

    expect(fixture.componentInstance.ageGate.status()).toBe('confirmed');
    expect(confirmedSpy).toHaveBeenCalled();
  });

  it('deny() shows the restricted message and moves focus to it', async () => {
    const fixture = TestBed.createComponent(AgeGateComponent);
    fixture.detectChanges();

    fixture.componentInstance.deny();
    fixture.detectChanges();

    expect(fixture.componentInstance.ageGate.status()).toBe('denied');

    const compiled = fixture.nativeElement as HTMLElement;
    const denied = compiled.querySelector('[role="alert"]');
    expect(denied?.textContent).toContain('Access restricted');

    await new Promise((resolve) => setTimeout(resolve));
    expect(document.activeElement).toBe(denied);
  });

  it('Escape key on the dialog denies', () => {
    const fixture = TestBed.createComponent(AgeGateComponent);
    fixture.detectChanges();

    const dialog = (fixture.nativeElement as HTMLElement).querySelector(
      '[role="dialog"]'
    ) as HTMLElement;
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(fixture.componentInstance.ageGate.status()).toBe('denied');
  });
});
