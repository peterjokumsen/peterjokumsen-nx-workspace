import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ArticleComponent } from '@peterjokumsen/ui-elements';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [CommonModule, FaIconComponent, ArticleComponent],
  template: ` <pj-ui-article [sections]="content"></pj-ui-article> `,
  styleUrl: 'about-me.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutMeComponent {
  content = [
    {
      title: 'Who am I?',
      content: [
        'I am a software engineer who loves to build things.',
        'I have been working in the software industry for over 10 years.',
        'I am passionate about learning new technologies and solving problems in interesting ways.',
      ],
    },
    {
      title: 'What is the purpose of this blog?',
      content: [
        'The purpose of this blog is to share my knowledge and experiences with others.',
        'I hope to help others learn new things and grow as software engineers.',
      ],
    },
    {
      title: 'What will you find on this blog?',
      content: [
        'On this blog, you will find articles on various topics related to software engineering.',
        "I will cover topics such as programming languages, frameworks, tools, best practices, workarounds that I've found and some completely unrelated topics too.",
      ],
    },
  ];
}
