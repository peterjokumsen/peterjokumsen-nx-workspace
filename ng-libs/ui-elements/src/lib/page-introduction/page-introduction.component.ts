import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { IntroductionCallToAction } from './models';

@Component({
  selector: 'pj-ui-page-introduction',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="background flex min-h-screen flex-col items-start"
      [attr.style]="backgroundStyle()"
    >
      <div
        class="main-colors m-5 items-center rounded border-2 bg-opacity-50 p-12"
      >
        <h1 class="mb-8 justify-start text-3xl font-bold">{{ title() }}</h1>
        @for (paragraph of paragraphs(); track paragraph) {
          <p class="mb-6 text-xl">{{ paragraph }}</p>
        }
        @if (callToActions().length > 0) {
          <div class="actions mt-8 flex flex-col gap-4">
            @for (action of callToActions(); track action.label) {
              <a
                href="#"
                class="pj-button {{ action.type || 'primary' }} text-center"
                (click)="action.onClick($event)"
              >
                {{ action.label }}
              </a>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .background {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: top;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageIntroductionComponent {
  title = input('👋 Hi there!');
  backgroundUrl = input('/assets/pug_1280.webp');
  paragraphs = input<string[]>([]);
  actions = input<IntroductionCallToAction | IntroductionCallToAction[]>();

  backgroundStyle = computed(
    () => `background-image: url('${this.backgroundUrl()}')`,
  );
  callToActions = computed(() => {
    const actions = this.actions();
    if (!actions) {
      return [];
    }

    return Array.isArray(actions) ? actions : [actions];
  });
}
