import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { NavigationTabsComponent } from './navigation-tabs.component';

@Component({ selector: 'app-test-stub', standalone: true, template: '' })
class TestStubComponent {}

describe('NavigationTabsComponent', () => {
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationTabsComponent],
      providers: [
        provideRouter([
          { path: 'french-press', component: TestStubComponent },
          { path: 'matcha', component: TestStubComponent },
          { path: 'espresso', component: TestStubComponent },
          { path: 'cocktails', component: TestStubComponent },
        ]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(NavigationTabsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a role="tablist" with 4 role="tab" links', async () => {
    const fixture = TestBed.createComponent(NavigationTabsComponent);
    await router.navigateByUrl('/french-press');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[role="tablist"]')).toBeTruthy();
    expect(compiled.querySelectorAll('[role="tab"]').length).toBe(4);
  });

  it('marks the tab for the active route as aria-selected true', async () => {
    const fixture = TestBed.createComponent(NavigationTabsComponent);
    await router.navigateByUrl('/matcha');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const selected = compiled.querySelectorAll('[aria-selected="true"]');
    expect(selected.length).toBe(1);
    expect(selected[0].textContent).toContain('Matcha');
  });

  it('marks inactive tabs as aria-selected false', async () => {
    const fixture = TestBed.createComponent(NavigationTabsComponent);
    await router.navigateByUrl('/matcha');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const unselected = compiled.querySelectorAll('[aria-selected="false"]');
    expect(unselected.length).toBe(3);
  });

  it('moves focus to the next tab on ArrowRight', async () => {
    const fixture = TestBed.createComponent(NavigationTabsComponent);
    await router.navigateByUrl('/french-press');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const tabs = compiled.querySelectorAll<HTMLElement>('[role="tab"]');
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    Object.defineProperty(event, 'currentTarget', { value: tabs[0] });

    fixture.componentInstance.onKeydown(event, 0);

    expect(document.activeElement).toBe(tabs[1]);
  });
});
