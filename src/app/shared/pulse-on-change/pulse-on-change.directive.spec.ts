import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PulseOnChangeDirective } from './pulse-on-change.directive';

@Component({
  standalone: true,
  imports: [PulseOnChangeDirective],
  template: `<span [appPulseOnChange]="value">{{ value }}</span>`,
})
class TestHostComponent {
  value = 1;
}

describe('PulseOnChangeDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  it('does not pulse on the initial render', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const el = (fixture.nativeElement as HTMLElement).querySelector('span');
    expect(el?.classList.contains('pulse-on-change')).toBe(false);
  });

  it('adds pulse-on-change on a subsequent change', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const directive = fixture.debugElement
      .query(By.directive(PulseOnChangeDirective))
      .injector.get(PulseOnChangeDirective);
    const el = (fixture.nativeElement as HTMLElement).querySelector('span') as HTMLElement;

    directive.value = 2;
    directive.ngOnChanges();

    expect(el.classList.contains('pulse-on-change')).toBe(true);
  });

  it('restarts the animation (removes then re-adds the class) on each change', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const directive = fixture.debugElement
      .query(By.directive(PulseOnChangeDirective))
      .injector.get(PulseOnChangeDirective);
    const el = (fixture.nativeElement as HTMLElement).querySelector('span') as HTMLElement;

    directive.value = 2;
    directive.ngOnChanges();
    expect(el.classList.contains('pulse-on-change')).toBe(true);

    el.classList.remove('pulse-on-change');
    directive.value = 3;
    directive.ngOnChanges();
    expect(el.classList.contains('pulse-on-change')).toBe(true);
  });
});
