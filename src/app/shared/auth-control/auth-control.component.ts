import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-auth-control',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './auth-control.component.html',
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
}
