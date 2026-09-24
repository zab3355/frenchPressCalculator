import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { withCsrfHeader } from '../../core/http/csrf';

export interface RecentEvent {
  drinkType: string;
  eventType: 'VIEW' | 'CALCULATE';
  createdAt: string;
}

export interface DrinkTypeCount {
  drinkType: string;
  count: number;
}

export type DefaultDrinkType = 'french-press' | 'espresso' | 'matcha' | 'cocktails';
export type Units = 'metric' | 'imperial';

export interface Preferences {
  defaultDrinkType: DefaultDrinkType;
  units: Units;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  getRecentEvents(): Observable<RecentEvent[]> {
    return this.http.get<RecentEvent[]>('/api/events/recent', { withCredentials: true });
  }

  getSummary(): Observable<DrinkTypeCount[]> {
    return this.http.get<DrinkTypeCount[]>('/api/events/summary', { withCredentials: true });
  }

  getPreferences(): Observable<Preferences> {
    return this.http.get<Preferences>('/api/preferences', { withCredentials: true });
  }

  updatePreferences(update: Partial<Preferences>): Observable<Preferences> {
    return this.http.patch<Preferences>('/api/preferences', update, withCsrfHeader());
  }
}
