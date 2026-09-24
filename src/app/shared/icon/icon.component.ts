import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type IconName = 'github' | 'linkedin' | 'portfolio';

const ICON_ASSET_PATHS: Record<IconName, string> = {
  github: '/icons/github.svg',
  linkedin: '/icons/linkedin.svg',
  portfolio: '/icons/language.svg',
};

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
  styles: `
    :host {
      display: inline-flex;
    }

    .social-icon {
      background-color: var(--icon-color, var(--text-emphasis));
      display: block;
      height: var(--icon-size, 1.45rem);
      -webkit-mask-position: center;
      mask-position: center;
      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;
      -webkit-mask-size: contain;
      mask-size: contain;
      transition: background-color 200ms ease;
      width: var(--icon-size, 1.45rem);
    }
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();

  protected readonly maskImage = computed(() => `url(${ICON_ASSET_PATHS[this.name()]})`);
}
