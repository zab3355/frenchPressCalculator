import { isPlatformBrowser } from '@angular/common';
import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export type Theme = 'french-press' | 'matcha' | 'espresso' | 'cocktails';

/**
 * Drives the app-wide visual theme from the active route's `data.theme`.
 * The DOM write (`document.documentElement.dataset.theme`) is centralized
 * here so feature components never need to know theming exists.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  readonly currentTheme = signal<Theme>('french-press');

  constructor() {
    effect(() => {
      const theme = this.currentTheme();

      if (isPlatformBrowser(this.platformId)) {
        document.documentElement.dataset['theme'] = theme;
      }
    });
  }

  /** Call once from the app shell to start reacting to route changes. */
  init(): void {
    this.applyThemeFromRoute();

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.applyThemeFromRoute());
  }

  private applyThemeFromRoute(): void {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }

    const theme = route.data['theme'] as Theme | undefined;
    if (theme) {
      this.currentTheme.set(theme);
    }
  }
}
