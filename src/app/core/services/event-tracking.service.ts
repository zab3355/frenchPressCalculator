import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { withCsrfHeader } from '../http/csrf';

export type TrackedDrinkType = 'french-press' | 'espresso' | 'matcha' | 'cocktails';
export type TrackedEventType = 'VIEW' | 'CALCULATE';

/**
 * Fire-and-forget: anonymous use of the calculators must never be affected
 * by tracking, so this no-ops when logged out and swallows any request
 * failure rather than surfacing it to the user.
 */
@Injectable({ providedIn: 'root' })
export class EventTrackingService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  record(drinkType: TrackedDrinkType, eventType: TrackedEventType): void {
    if (!this.authService.currentUser()) {
      return;
    }

    this.http
      .post('/api/events', { drinkType, eventType }, withCsrfHeader())
      .pipe(catchError(() => EMPTY))
      .subscribe();
  }
}
