import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavTab {
  path: string;
  label: string;
}

/** Route-backed tab strip for switching between drink calculators. */
@Component({
  selector: 'app-navigation-tabs',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationTabsComponent {
  readonly tabs: NavTab[] = [
    { path: 'french-press', label: 'French Press' },
    { path: 'matcha', label: 'Matcha' },
    { path: 'espresso', label: 'Espresso' },
    { path: 'cocktails', label: 'Cocktails' },
  ];

  onKeydown(event: KeyboardEvent, index: number): void {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return;
    }

    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (index + direction + this.tabs.length) % this.tabs.length;
    const tabElements = (event.currentTarget as HTMLElement)
      .closest('[role="tablist"]')
      ?.querySelectorAll<HTMLElement>('[role="tab"]');

    tabElements?.[nextIndex]?.focus();
  }
}
