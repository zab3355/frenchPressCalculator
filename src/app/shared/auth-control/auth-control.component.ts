import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CurrentUser } from '../../core/auth/current-user.model';

@Component({
  selector: 'app-auth-control',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './auth-control.component.html',
  styleUrl: './auth-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthControlComponent {
  protected readonly authService = inject(AuthService);

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }

  protected initials(user: CurrentUser): string {
    const source = user.displayName || user.email;
    return source.charAt(0).toUpperCase();
  }
}
