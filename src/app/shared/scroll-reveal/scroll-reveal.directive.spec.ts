import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ScrollRevealDirective } from './scroll-reveal.directive';

@Component({
  standalone: true,
  imports: [ScrollRevealDirective],
  template: `<div appScrollReveal class="reveal">content</div>`,
})
class TestHostComponent {}

describe('ScrollRevealDirective', () => {
  let observeSpy: ReturnType<typeof vi.fn>;
  let unobserveSpy: ReturnType<typeof vi.fn>;
  let capturedCallback: IntersectionObserverCallback | undefined;

  beforeEach(() => {
    observeSpy = vi.fn();
    unobserveSpy = vi.fn();
    capturedCallback = undefined;

    class MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        capturedCallback = callback;
      }
      observe = observeSpy;
      unobserve = unobserveSpy;
      disconnect = vi.fn();
    }

    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
      MockIntersectionObserver;
  });

  it('starts hidden and observes the host element', async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const el = (fixture.nativeElement as HTMLElement).querySelector('.reveal') as HTMLElement;
    expect(el.classList.contains('is-visible')).toBe(false);
    expect(observeSpy).toHaveBeenCalledWith(el);
  });

  it('adds is-visible and stops observing once intersecting', async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const el = (fixture.nativeElement as HTMLElement).querySelector('.reveal') as HTMLElement;
    capturedCallback?.([{ isIntersecting: true, target: el } as unknown as IntersectionObserverEntry], {} as IntersectionObserver);

    expect(el.classList.contains('is-visible')).toBe(true);
    expect(unobserveSpy).toHaveBeenCalledWith(el);
  });

  it('does not reveal on a non-intersecting entry', async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const el = (fixture.nativeElement as HTMLElement).querySelector('.reveal') as HTMLElement;
    capturedCallback?.([{ isIntersecting: false, target: el } as unknown as IntersectionObserverEntry], {} as IntersectionObserver);

    expect(el.classList.contains('is-visible')).toBe(false);
    expect(unobserveSpy).not.toHaveBeenCalled();
  });
});
