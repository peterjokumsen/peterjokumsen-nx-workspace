import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import {
  IntroductionCallToAction,
  PageIntroductionComponent,
} from '@peterjokumsen/ui-elements';

import { AboutMeComponent } from '../../components/about-me';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, AboutMeComponent, PageIntroductionComponent],
  template: `
    <pj-ui-page-introduction
      [paragraphs]="introductionContent"
      [actions]="introductionActions"
      (callToAction)="navigateTo($event)"
    ></pj-ui-page-introduction>

    <div #aboutMe>
      @defer {
        <app-about-me></app-about-me>
      }
    </div>
  `,
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent {
  private _router = inject(Router);

  @ViewChild('aboutMe') aboutMe!: ElementRef;

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
    if (action.id === 'development-notes') {
      await this._router.navigate(['/development-notes']);
    } else {
      this.aboutMe?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
