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
 * Themed dot+ring cursor that follows the pointer and grows over interactive
 * elements. Only activates for mouse-capable, motion-tolerant visitors:
 * touch devices (no hover/fine pointer) and `prefers-reduced-motion` both
 * opt out entirely, leaving the native cursor untouched.
 */
@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  template: `
    @if (enabled) {
      <div #dot class="custom-cursor-dot" aria-hidden="true"></div>
      <div #ring class="custom-cursor-ring" aria-hidden="true"></div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomCursorComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('dot') private readonly dotRef?: ElementRef<HTMLElement>;
  @ViewChild('ring') private readonly ringRef?: ElementRef<HTMLElement>;

  enabled = false;

  private readonly onMouseMove = (event: MouseEvent): void => {
    const transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    this.dotRef?.nativeElement.style.setProperty('transform', transform);
    this.ringRef?.nativeElement.style.setProperty('transform', transform);

    const target = event.target as HTMLElement | null;
    const interactive = !!target?.closest?.('a, button, input, select, [role="tab"]');
    this.ringRef?.nativeElement.classList.toggle('custom-cursor-ring--active', interactive);
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
