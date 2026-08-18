import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';

/**
 * Themed arrow cursor that follows the pointer and grows slightly over
 * interactive elements. Only activates for mouse-capable, motion-tolerant
 * visitors: touch devices (no hover/fine pointer) and `prefers-reduced-motion`
 * both opt out entirely, leaving the native cursor untouched.
 */
@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  template: `
    @if (enabled) {
      <svg #arrow class="custom-cursor-arrow" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M1 1 L1 14.7 L5.1 11.4 L7.8 17.7 L10.4 16.5 L7.7 10.4 L13.2 10.4 Z" />
      </svg>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomCursorComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('arrow') private readonly arrowRef?: ElementRef<SVGElement>;

  enabled = false;

  private readonly onMouseMove = (event: MouseEvent): void => {
    const el = this.arrowRef?.nativeElement;
    if (!el) {
      return;
    }

    el.style.setProperty('translate', `${event.clientX}px ${event.clientY}px`);

    const target = event.target as HTMLElement | null;
    const interactive = !!target?.closest?.('a, button, input, select, [role="tab"]');
    el.classList.toggle('custom-cursor-arrow--active', interactive);
  };

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId) || typeof window.matchMedia !== 'function') {
      return;
    }

    this.enabled =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.enabled) {
      document.body.classList.add('custom-cursor-active');
      window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.enabled) {
      window.removeEventListener('mousemove', this.onMouseMove);
      document.body.classList.remove('custom-cursor-active');
    }
  }
}
