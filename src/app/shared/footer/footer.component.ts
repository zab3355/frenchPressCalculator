import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

/**
 * Footer component displaying site footer with social links and copyright.
 *
 * Uses OnPush change detection strategy for optimal performance.
 * The current year is dynamically calculated and updated as a signal.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  /** Current year for copyright display, automatically updated */
  readonly currentYear = signal(new Date().getFullYear());
}
