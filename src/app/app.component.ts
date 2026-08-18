import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/theme/theme.service';
import { CustomCursorComponent } from './shared/custom-cursor/custom-cursor.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavigationTabsComponent } from './shared/navigation-tabs/navigation-tabs.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationTabsComponent, FooterComponent, CustomCursorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly themeService = inject(ThemeService);

  constructor() {
    this.themeService.init();
  }
}
