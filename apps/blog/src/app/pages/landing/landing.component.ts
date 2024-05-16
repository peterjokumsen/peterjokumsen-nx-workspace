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
      label: 'Go to blog',
      onClick: (e) => this.navigateTo('blog', e),
    },
    {
      label: 'More about me',
      onClick: (e) => this.navigateTo('about-me', e),
      type: 'main',
    },
  ];

  async navigateTo(destination: 'blog' | 'about-me', event: Event) {
    event.preventDefault();

    if (destination === 'blog') {
      await this._router.navigate(['/blog']);
    } else {
      this.aboutMe?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
