import { TestBed } from '@angular/core/testing';
import { IconComponent, IconName } from './icon.component';

describe('IconComponent', () => {
  const assetPathByName: Record<IconName, string> = {
    github: 'icons/github.svg',
    linkedin: 'icons/linkedin.svg',
    portfolio: 'icons/language.svg',
  };

  it('should create the component', () => {
    const fixture = TestBed.createComponent(IconComponent);
    fixture.componentRef.setInput('name', 'github');
    expect(fixture.componentInstance).toBeTruthy();
  });

  (Object.keys(assetPathByName) as IconName[]).forEach((name) => {
    it(`masks the "${name}" icon asset`, () => {
      const fixture = TestBed.createComponent(IconComponent);
      fixture.componentRef.setInput('name', name);
      fixture.detectChanges();

      const span = (fixture.nativeElement as HTMLElement).querySelector('span.social-icon');
      expect(span).toBeTruthy();
      expect(span?.getAttribute('style')).toContain(assetPathByName[name]);
    });
  });
});
