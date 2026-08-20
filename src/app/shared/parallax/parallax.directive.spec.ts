import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ParallaxDirective } from './parallax.directive';

function mockMatchMedia(reducedMotion: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === '(prefers-reduced-motion: reduce)' ? reducedMotion : false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

@Component({
  standalone: true,
  imports: [ParallaxDirective],
  template: `<div [appParallax]="0.2"></div>`,
})
class TestHostComponent {}

describe('ParallaxDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
  });

  it('should create the host', () => {
    mockMatchMedia(false);
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('does not throw when prefers-reduced-motion is set', () => {
    mockMatchMedia(true);
    expect(() => {
      const fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();
    }).not.toThrow();
  });
});
