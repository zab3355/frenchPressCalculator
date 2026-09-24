import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ScrollRevealDirective } from '../../shared/scroll-reveal/scroll-reveal.directive';
import {
  DashboardService,
  DefaultDrinkType,
  DrinkTypeCount,
  RecentEvent,
  Units,
} from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, ScrollRevealDirective],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  readonly recentEvents = signal<RecentEvent[]>([]);
  readonly summary = signal<DrinkTypeCount[]>([]);
  readonly loadingRecent = signal(true);
  readonly loadingSummary = signal(true);
  readonly loadingPreferences = signal(true);

  readonly defaultDrinkTypeControl = new FormControl<DefaultDrinkType>('french-press', {
    nonNullable: true,
  });
  readonly unitsControl = new FormControl<Units>('metric', { nonNullable: true });

  ngOnInit(): void {
    this.dashboardService.getRecentEvents().subscribe({
      next: (events) => {
        this.recentEvents.set(events);
        this.loadingRecent.set(false);
      },
      error: () => {
        this.loadingRecent.set(false);
      },
    });

    this.dashboardService.getSummary().subscribe({
      next: (summary) => {
        this.summary.set(summary);
        this.loadingSummary.set(false);
      },
      error: () => {
        this.loadingSummary.set(false);
      },
    });

    this.dashboardService.getPreferences().subscribe({
      next: (preferences) => {
        this.defaultDrinkTypeControl.setValue(preferences.defaultDrinkType, { emitEvent: false });
        this.unitsControl.setValue(preferences.units, { emitEvent: false });
        this.loadingPreferences.set(false);
      },
      error: () => {
        this.loadingPreferences.set(false);
      },
    });

    this.defaultDrinkTypeControl.valueChanges.subscribe((defaultDrinkType) => {
      this.dashboardService.updatePreferences({ defaultDrinkType }).subscribe({
        error: (err) => console.error('Failed to save default drink type preference', err),
      });
    });

    this.unitsControl.valueChanges.subscribe((units) => {
      this.dashboardService.updatePreferences({ units }).subscribe({
        error: (err) => console.error('Failed to save units preference', err),
      });
    });
  }
}
