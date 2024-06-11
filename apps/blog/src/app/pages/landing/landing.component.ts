import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  IntroductionCallToAction,
  PageIntroductionComponent,
} from '@peterjokumsen/ui-elements';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, PageIntroductionComponent],
  template: `
    <pj-ui-page-introduction
      [paragraphs]="introductionContent"
      [actions]="introductionActions"
      (callToAction)="navigateTo($event)"
    ></pj-ui-page-introduction>
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  private _router = inject(Router);

  introductionContent = [
    'Welcome to my blog!',
    'This is a work in progress, please feel free to look around.',
  ];
  introductionActions: IntroductionCallToAction[] = [
    {
      id: 'development-notes',
      label: 'Peruse notes',
    },
    {
      id: 'about-me',
      label: 'More about me',
      type: 'main',
    },
  ];

  async navigateTo(action: IntroductionCallToAction) {
    await this._router.navigate([action.id]);
  }
}
