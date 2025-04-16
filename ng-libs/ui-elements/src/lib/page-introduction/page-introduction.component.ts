import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import {
  IntroductionBackgroundStyle,
  IntroductionCallToAction,
} from './models';
import {
  PjBrowserTools,
  providePjBrowserTools,
} from '@peterjokumsen/ng-services';

import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'pj-ui-page-introduction',
  imports: [CommonModule, MatButton],
  providers: [providePjBrowserTools()],
  template: `
    <div class="intro-container" [attr.style]="backgroundStyle()">
      <div class="intro-dialog">
        <h1 class="intro-title">
          {{ introductionTitle() }}
        </h1>
        @for (paragraph of paragraphs(); track paragraph) {
          <p class="intro-paragraph">{{ paragraph }}</p>
        }
        <ng-content />
        @if (callToActions().length > 0) {
          <div class="intro-actions">
            @for (action of callToActions(); track action.label) {
              <button
                mat-raised-button
                type="button"
                [color]="action.type || 'primary'"
                class="intro-button"
                (click)="onClick(action)"
              >
                <span class="intro-button-text">{{ action.label }}</span>
              </button>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .intro-container {
      display: flex;
      min-height: 100vh;
      flex-direction: column;
      align-items: flex-start;
    }

    .intro-dialog {
      background-color: color-mix(
        in srgb,
        var(--mat-sys-surface) 60%,
        transparent
      );
      color: var(--mat-sys-on-surface);
      padding: 3rem;
      border-width: 2px;
      align-items: center;
      margin: 5rem;
      font-size: 1.2rem;
      border-radius: 10px;
      box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .intro-title {
      margin-bottom: 2rem;
      text-align: left;
      font-size: 1.875rem;
      font-weight: bold;
    }

    .intro-paragraph {
      margin-bottom: 1.5rem;
      font-size: 1.25rem;
    }

    .intro-actions {
      margin-top: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .intro-button {
      text-align: center;
    }

    .intro-button-text {
      font-size: 1.25rem;
      font-weight: bold;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageIntroductionComponent {
  private readonly _defaultStyle: IntroductionBackgroundStyle = {
    url: '/assets/intro_background.webp',
    size: 'cover',
    repeat: 'no-repeat',
    position: 'top',
  };

  private _browserTools = inject(PjBrowserTools);

  introductionTitle = input('👋 Hi there!');
  style = input<IntroductionBackgroundStyle | undefined>({});
  paragraphs = input<string[]>([]);
  actions = input<string | IntroductionCallToAction[]>();

  callToAction = output<IntroductionCallToAction>();

  backgroundStyle = computed(() => {
    const style = this.style();
    if (!style) {
      return '';
    }

    const styleStrings = Object.entries(this._defaultStyle).reduce(
      (acc: string[], [key, defaultValue]) => {
        let styleKey: string = key;
        let value: string =
          style[key as keyof IntroductionBackgroundStyle] ?? defaultValue ?? '';
        if (key === 'url') {
          value = this.prepareBackgroundUrl(style.url || value);
          styleKey = 'image';
        }

        acc.push(`background-${styleKey}:${value}`);
        return acc;
      },
      [],
    );
    return styleStrings.join(';');
  });

  callToActions = computed(() => {
    const actions = this.actions();
    if (!actions) {
      return [];
    } else if (typeof actions === 'string') {
      return [{ label: actions }];
    }

    return Array.isArray(actions) ? actions : [actions];
  });

  private prepareBackgroundUrl(urlValue: string): string {
    const linkElement = this._browserTools.getOrCreateLinkElement(
      'introduction-background',
    );
    if (linkElement) {
      linkElement.href = urlValue;
      linkElement.as = 'image';
      linkElement.fetchPriority = 'high';
      linkElement.rel = 'preload';
    }

    return `url("${urlValue}")`;
  }

  onClick(action: IntroductionCallToAction) {
    this.callToAction.emit(action);
  }
}
