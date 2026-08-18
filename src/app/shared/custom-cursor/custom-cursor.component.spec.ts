import { TestBed } from '@angular/core/testing';
import { CustomCursorComponent } from './custom-cursor.component';

function mockMatchMedia(matches: Record<string, boolean>) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: matches[query] ?? false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('CustomCursorComponent', () => {
  afterEach(() => {
    document.body.classList.remove('custom-cursor-active');
  });

  it('should create the component', async () => {
    mockMatchMedia({});
    await TestBed.configureTestingModule({ imports: [CustomCursorComponent] }).compileComponents();

    const fixture = TestBed.createComponent(CustomCursorComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('enables when hover+fine pointer is supported and motion is not reduced', async () => {
    mockMatchMedia({
      '(hover: hover) and (pointer: fine)': true,
      '(prefers-reduced-motion: reduce)': false,
    });
    await TestBed.configureTestingModule({ imports: [CustomCursorComponent] }).compileComponents();

    const fixture = TestBed.createComponent(CustomCursorComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.enabled).toBe(true);
    expect(document.body.classList.contains('custom-cursor-active')).toBe(true);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.custom-cursor-dot')).toBeTruthy();
    expect(compiled.querySelector('.custom-cursor-ring')).toBeTruthy();
  });

  it('stays disabled on touch devices (no hover/fine pointer)', async () => {
    mockMatchMedia({
      '(hover: hover) and (pointer: fine)': false,
      '(prefers-reduced-motion: reduce)': false,
    });
    await TestBed.configureTestingModule({ imports: [CustomCursorComponent] }).compileComponents();

    const fixture = TestBed.createComponent(CustomCursorComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.enabled).toBe(false);
    expect(document.body.classList.contains('custom-cursor-active')).toBe(false);
    expect((fixture.nativeElement as HTMLElement).querySelector('.custom-cursor-dot')).toBeNull();
  });

  it('stays disabled when prefers-reduced-motion is set', async () => {
    mockMatchMedia({
      '(hover: hover) and (pointer: fine)': true,
      '(prefers-reduced-motion: reduce)': true,
    });
    await TestBed.configureTestingModule({ imports: [CustomCursorComponent] }).compileComponents();

    const fixture = TestBed.createComponent(CustomCursorComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.enabled).toBe(false);
  });

  it('moves the cursor elements on mousemove', async () => {
    mockMatchMedia({
      '(hover: hover) and (pointer: fine)': true,
      '(prefers-reduced-motion: reduce)': false,
    });
    await TestBed.configureTestingModule({ imports: [CustomCursorComponent] }).compileComponents();

    const fixture = TestBed.createComponent(CustomCursorComponent);
    fixture.detectChanges();

    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 120, clientY: 80 }));

    const dot = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('.custom-cursor-dot');
    expect(dot?.style.transform).toBe('translate3d(120px, 80px, 0)');
  });
});
