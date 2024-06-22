import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MdRendererComponent } from '@peterjokumsen/md-renderer';
import { parseMarkdown } from '@peterjokumsen/md-parser';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [CommonModule, FaIconComponent, MdRendererComponent],
  template: `
    <pj-mdr-md-renderer [parsedContent]="markdown"></pj-mdr-md-renderer>
  `,
  styleUrl: 'about-me.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutMeComponent {
  markdown = parseMarkdown(`
# Who am i?

I am a software engineer who loves to build things.
I have been working in the software industry for over 10 years.
I am passionate about learning new technologies and solving problems in interesting ways.

# What is the purpose of this blog?

The purpose of this blog is to share my knowledge and experiences with others.
I hope to help others learn new things and grow as software engineers.

# What will you find on this blog?

On this blog, you will find articles on various topics related to software engineering.
I will cover topics such as programming languages, frameworks, tools, best practices, workarounds that I've found and some completely unrelated topics too.

# Where is the repository for this blog?

The repository for this blog is available on GitHub.
![new image](/assets/images/basic-image.webp)
You can find it at [peterjokumsen/peterjokumsen-nx-workspace](https://github.com/peterjokumsen/peterjokumsen-nx-workspace?tab=readme-ov-file#peterjokumsen-blog).
`);
}
