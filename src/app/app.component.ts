import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { ThemeService } from './core/theme/theme.service';
import { AuthControlComponent } from './shared/auth-control/auth-control.component';
import { CustomCursorComponent } from './shared/custom-cursor/custom-cursor.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavigationTabsComponent } from './shared/navigation-tabs/navigation-tabs.component';
import { ParallaxDirective } from './shared/parallax/parallax.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavigationTabsComponent,
    AuthControlComponent,
    FooterComponent,
    CustomCursorComponent,
    ParallaxDirective,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);

  constructor() {
    this.themeService.init();
    this.authService.init();
  }
}
