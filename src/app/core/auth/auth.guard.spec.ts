import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    authService = TestBed.inject(AuthService);
  });

  function runGuard(): Observable<boolean | UrlTree> {
    return TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never)
    ) as Observable<boolean | UrlTree>;
  }

  it('allows activation once currentUser resolves to a logged-in user', async () => {
    const result$ = runGuard();
    authService.currentUser.set({ id: 1, email: 'a@example.com', displayName: 'Ada' });

    expect(await firstValueFrom(result$)).toBe(true);
  });

  it('redirects to /french-press once currentUser resolves to null', async () => {
    const result$ = runGuard();
    authService.currentUser.set(null);

    const result = await firstValueFrom(result$);
    const router = TestBed.inject(Router);
    expect(router.serializeUrl(result as UrlTree)).toBe('/french-press');
  });

  it('waits for currentUser to resolve before deciding (does not redirect while undefined)', async () => {
    const result$ = runGuard();
    let settled = false;
    result$.subscribe(() => {
      settled = true;
    });

    expect(settled).toBe(false);

    authService.currentUser.set(null);
    await firstValueFrom(result$);
  });
});
