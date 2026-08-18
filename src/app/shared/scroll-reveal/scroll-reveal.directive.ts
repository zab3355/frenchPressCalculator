import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';

/**
 * Adds `is-visible` to the host once it scrolls into view, which is what
 * arms the `.reveal` CSS animation (see styles.scss). Falls back to
 * revealing immediately on the server, when IntersectionObserver isn't
 * available, or once the element has already been observed once.
 */
@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') {
      this.renderer.addClass(this.elementRef.nativeElement, 'is-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.renderer.addClass(this.elementRef.nativeElement, 'is-visible');
            this.observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 }
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
