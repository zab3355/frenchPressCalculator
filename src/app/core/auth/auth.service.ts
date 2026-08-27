import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { withCsrfHeader } from '../http/csrf';
import { CurrentUser } from './current-user.model';

/**
 * Session state lives server-side (Spring Security). This service just
 * mirrors it: currentUser is `undefined` until the initial /api/me call
 * resolves, then either a CurrentUser or null. The undefined state lets
 * authGuard wait for the real answer instead of redirecting prematurely.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  readonly currentUser = signal<CurrentUser | null | undefined>(undefined);

  init(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.currentUser.set(null);
      return;
    }

    this.http
      .get<CurrentUser>('/api/me', { withCredentials: true })
      .pipe(
        tap((user) => this.currentUser.set(user)),
        catchError(() => {
          this.currentUser.set(null);
          return of(null);
        })
      )
      .subscribe();
  }

  login(): void {
    window.location.href = '/oauth2/authorization/google';
  }

  logout(): void {
    this.http.post('/api/auth/logout', null, withCsrfHeader()).subscribe({
      next: () => {
        this.currentUser.set(null);
        this.router.navigateByUrl('/french-press');
      },
      error: () => {
        this.currentUser.set(null);
        this.router.navigateByUrl('/french-press');
      },
    });
  }
}
