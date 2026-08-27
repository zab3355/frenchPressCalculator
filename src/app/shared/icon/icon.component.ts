import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type IconName = 'github' | 'linkedin' | 'portfolio';

const ICON_ASSET_PATHS: Record<IconName, string> = {
  github: 'icons/github.svg',
  linkedin: 'icons/linkedin.svg',
  portfolio: 'icons/language.svg',
};

/** Renders via CSS mask (not <img>) so `.social-icon`'s `currentColor` hover theming still applies. */
@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span
    class="social-icon"
    [style.mask-image]="maskImage()"
    [style.-webkit-mask-image]="maskImage()"
    aria-hidden="true"
  ></span>`,
})
export class IconComponent {
  readonly name = input.required<IconName>();

  protected readonly maskImage = computed(() => `url(${ICON_ASSET_PATHS[this.name()]})`);
}
