import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  IntroductionBackgroundStyle,
  PageIntroductionComponent,
} from '@peterjokumsen/ui-elements';

import { CommonModule } from '@angular/common';
import { PjLogger } from '@peterjokumsen/ng-services';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, PageIntroductionComponent],
  template: `
    <pj-ui-page-introduction
      introductionTitle="🫣 Oops!"
      [paragraphs]="paragraphs"
      [style]="backgroundStyle"
      [actions]="[{ label: 'Go home' }]"
      (callToAction)="router.navigate(['/'])"
    ></pj-ui-page-introduction>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent implements OnInit {
  private _logger = inject(PjLogger);

  router = inject(Router);

  backgroundStyle: IntroductionBackgroundStyle = {
    url: '/assets/not_found_background.webp',
  };
  paragraphs = ['The page you are looking for seems to be missing.'];

  ngOnInit() {
    this._logger.to.warn(
      'User tried to access a non-existing page: "%s"',
      this.router.url,
    );
  }
}
