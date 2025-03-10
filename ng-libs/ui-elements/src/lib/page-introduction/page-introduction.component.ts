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
    <div
      class="flex min-h-screen flex-col items-start"
      [attr.style]="backgroundStyle()"
    >
      <div
        class="main-colors m-5 items-center rounded border-2 bg-opacity-50 p-12"
      >
        <h1 class="mb-8 justify-start text-3xl font-bold">
          {{ introductionTitle() }}
        </h1>
        @for (paragraph of paragraphs(); track paragraph) {
          <p class="introduction-content mb-6 text-xl">{{ paragraph }}</p>
        }
        <ng-content />
        @if (callToActions().length > 0) {
          <div class="actions mt-8 flex flex-col gap-4">
            @for (action of callToActions(); track action.label) {
              <button
                mat-raised-button
                type="button"
                [color]="action.type || 'primary'"
                class="text-center"
                (click)="onClick(action)"
              >
                <span class="text-xl font-bold">{{ action.label }}</span>
              </button>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: ``,
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
