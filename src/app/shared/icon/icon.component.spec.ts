import { TestBed } from '@angular/core/testing';
import { IconComponent, IconName } from './icon.component';

describe('IconComponent', () => {
  const viewBoxByName: Record<IconName, string> = {
    github: '0 0 24 24',
    linkedin: '0 0 24 24',
    portfolio: '0 0 24 24',
  };

  it('should create the component', () => {
    const fixture = TestBed.createComponent(IconComponent);
    fixture.componentRef.setInput('name', 'github');
    expect(fixture.componentInstance).toBeTruthy();
  });

  (Object.keys(viewBoxByName) as IconName[]).forEach((name) => {
    it(`renders an svg with the correct viewBox for "${name}"`, () => {
      const fixture = TestBed.createComponent(IconComponent);
      fixture.componentRef.setInput('name', name);
      fixture.detectChanges();

      const svg = (fixture.nativeElement as HTMLElement).querySelector('svg');
      expect(svg).toBeTruthy();
      expect(svg?.getAttribute('viewBox')).toBe(viewBoxByName[name]);
      expect(svg?.classList.contains('social-icon')).toBe(true);
    });
  });

  it('renders nothing when the name has no match', () => {
    const fixture = TestBed.createComponent(IconComponent);
    fixture.componentRef.setInput('name', 'unknown' as IconName);
    fixture.detectChanges();

    const svg = (fixture.nativeElement as HTMLElement).querySelector('svg');
    expect(svg).toBeFalsy();
  });
});
