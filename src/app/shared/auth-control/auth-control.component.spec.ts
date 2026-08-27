import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthControlComponent } from './auth-control.component';
import { AuthService } from '../../core/auth/auth.service';

describe('AuthControlComponent', () => {
  let fixture: ComponentFixture<AuthControlComponent>;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AuthControlComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    fixture = TestBed.createComponent(AuthControlComponent);
    authService = TestBed.inject(AuthService);
  });

  it('renders nothing while the auth state is still resolving', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.auth-control-signin')).toBeNull();
    expect(fixture.nativeElement.querySelector('.auth-control-link')).toBeNull();
  });

  it('shows a sign-in button when logged out', () => {
    authService.currentUser.set(null);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.auth-control-signin');
    expect(button?.textContent).toContain('Sign in with Google');
  });

  it('shows the display name and sign-out button when logged in', () => {
    authService.currentUser.set({ id: 1, email: 'a@example.com', displayName: 'Ada' });
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('.auth-control-link');
    expect(link?.textContent).toContain('Ada');
    expect(fixture.nativeElement.querySelector('.auth-control-signout')).toBeTruthy();
  });

  it('calls authService.login() when the sign-in button is clicked', () => {
    const loginSpy = vi.spyOn(authService, 'login').mockImplementation(() => {});
    authService.currentUser.set(null);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.auth-control-signin').click();

    expect(loginSpy).toHaveBeenCalled();
  });

  it('calls authService.logout() when the sign-out button is clicked', () => {
    const logoutSpy = vi.spyOn(authService, 'logout').mockImplementation(() => {});
    authService.currentUser.set({ id: 1, email: 'a@example.com', displayName: 'Ada' });
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.auth-control-signout').click();

    expect(logoutSpy).toHaveBeenCalled();
  });
});
