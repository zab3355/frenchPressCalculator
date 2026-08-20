import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export type AgeGateStatus = 'unverified' | 'confirmed' | 'denied';

const STORAGE_KEY = 'cocktails-age-gate';

/**
 * Tracks whether the visitor has confirmed they're 21+ for the Cocktails
 * tab. Persisted to sessionStorage so the gate doesn't reappear on every
 * navigation within the same browser session, but resets on a fresh
 * session. A 'denied' answer is a hard stop for the session — there is
 * deliberately no way to flip back to 'unverified' from 'denied'.
 */
@Injectable({ providedIn: 'root' })
export class AgeGateService {
  private readonly platformId = inject(PLATFORM_ID);

  readonly status = signal<AgeGateStatus>(this.readStoredStatus());

  confirm(): void {
    this.setStatus('confirmed');
  }

  deny(): void {
    this.setStatus('denied');
  }

  private setStatus(status: AgeGateStatus): void {
    this.status.set(status);

    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(STORAGE_KEY, status);
    }
  }

  private readStoredStatus(): AgeGateStatus {
    if (!isPlatformBrowser(this.platformId)) {
      return 'unverified';
    }

    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored === 'confirmed' || stored === 'denied' ? stored : 'unverified';
  }
}
