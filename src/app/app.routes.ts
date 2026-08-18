import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'french-press', pathMatch: 'full' },
  {
    path: 'french-press',
    loadComponent: () =>
      import('./features/french-press/french-press.component').then(
        (m) => m.FrenchPressComponent
      ),
    data: { theme: 'french-press' },
  },
  {
    path: 'matcha',
    loadComponent: () =>
      import('./features/matcha/matcha.component').then((m) => m.MatchaComponent),
    data: { theme: 'matcha' },
  },
  {
    path: 'espresso',
    loadComponent: () =>
      import('./features/espresso/espresso.component').then((m) => m.EspressoComponent),
    data: { theme: 'espresso' },
  },
  {
    path: 'cocktails',
    loadComponent: () =>
      import('./features/cocktails/cocktails.component').then((m) => m.CocktailsComponent),
    data: { theme: 'cocktails' },
  },
  { path: '**', redirectTo: 'french-press' },
];
