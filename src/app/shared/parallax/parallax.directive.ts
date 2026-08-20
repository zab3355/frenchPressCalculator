import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';

/**
 * Offsets the host by a fraction of the page scroll position, using the
 * CSS `translate` property (not `transform`) so it composes cleanly with
 * any existing `transform`-based CSS animation on the same element instead
 * of fighting it for the property. Skips entirely under
 * `prefers-reduced-motion` and on the server.
 */
@Directive({
  selector: '[appParallax]',
  standalone: true,
})
export class ParallaxDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);

  @Input('appParallax') speed = 0.15;

  private ticking = false;
  private enabled = false;

  private readonly onScroll = (): void => {
    if (this.ticking) {
      return;
    }

    this.ticking = true;
    requestAnimationFrame(() => {
      const offset = Math.round(window.scrollY * this.speed);
      this.renderer.setStyle(this.elementRef.nativeElement, 'translate', `0 ${offset}px`);
      this.ticking = false;
    });
  };

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId) || typeof window.matchMedia !== 'function') {
      return;
    }

    this.enabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.enabled) {
      window.addEventListener('scroll', this.onScroll, { passive: true });
    }
  }

  ngOnDestroy(): void {
    if (this.enabled) {
      window.removeEventListener('scroll', this.onScroll);
    }
  }
}
