import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { DocsIndexService } from '@peterjokumsen/ng-services';
import {
  IntroductionCallToAction,
  PageIntroductionComponent,
} from '@peterjokumsen/ui-elements';

@Component({
  imports: [PageIntroductionComponent],
  template: `
    <pj-ui-page-introduction
      [paragraphs]="introductionContent"
      [actions]="dynamicActions()"
      (callToAction)="navigateTo($event)"
    ></pj-ui-page-introduction>
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  private _router = inject(Router);
  private _docsIndexService = inject(DocsIndexService);

  private _index = toSignal(this._docsIndexService.getIndex(), {
    initialValue: [],
  });

  dynamicActions = computed<IntroductionCallToAction[]>(() =>
    this._index().map((entry) => ({
      id: entry.path,
      label: entry.title,
      type: entry.path === 'about-me' ? 'primary' : 'secondary',
    })),
  );

  introductionContent = [
    'Welcome to my blog!',
    'This is a work in progress, please feel free to look around.',
  ];

  async navigateTo(action: IntroductionCallToAction) {
    await this._router.navigate([action.id]);
  }
}
