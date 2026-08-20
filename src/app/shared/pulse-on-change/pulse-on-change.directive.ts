import { Directive, ElementRef, inject, Input, OnChanges, Renderer2 } from '@angular/core';

/**
 * Briefly pulses the host element whenever the bound value changes —
 * used on metric displays so a recalculated result draws the eye
 * without relying on layout-shifting content. Skips the very first
 * change (initial render shouldn't animate). CSS handles the actual
 * `prefers-reduced-motion` collapse via the global animation-duration
 * override in styles.scss.
 */
@Directive({
  selector: '[appPulseOnChange]',
  standalone: true,
})
export class PulseOnChangeDirective implements OnChanges {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private hasRenderedOnce = false;

  @Input('appPulseOnChange') value: unknown;

  ngOnChanges(): void {
    if (!this.hasRenderedOnce) {
      this.hasRenderedOnce = true;
      return;
    }

    const el = this.elementRef.nativeElement;
    this.renderer.removeClass(el, 'pulse-on-change');
    void el.offsetWidth;
    this.renderer.addClass(el, 'pulse-on-change');
  }
}
