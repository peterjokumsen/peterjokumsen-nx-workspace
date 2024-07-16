import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MdRendererComponent } from '@peterjokumsen/md-renderer';
import { PjLogger } from '@peterjokumsen/ng-services';
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
export class AboutMeComponent implements OnInit {
  private _logger = inject(PjLogger, { optional: true });

  markdown = parseMarkdown(`
# Who am I?

I am a software engineer who **loves** to build things.

I have been working in the software industry for over *10* years.

I have been dabbling with software development for _even longer_.

Starting with deleting \`Windows 3.1\` files from my father's computer when I was 4/6 years old.

---

I am passionate about learning new technologies and solving problems in ***interesting ways***.

# What is the purpose of this blog?

The purpose of this blog is:

- share my knowledge and experiences with others
- learn new things and grow as a software engineer
- help others learn new things and grow as software engineers

# What will you find on this blog?

On this blog, you will find articles on various topics related to software engineering.

I will cover topics such as programming languages, frameworks, tools, best practices, workarounds that I've found and some completely unrelated topics too.

# Where is the repository for this blog?

The repository for this blog is available on GitHub.

![new image](/assets/images/basic-image.webp)

You can find it at [peterjokumsen/peterjokumsen-nx-workspace](https://github.com/peterjokumsen/peterjokumsen-nx-workspace?tab=readme-ov-file#peterjokumsen-blog).

\`\`\`shell
# Clone the repository
git clone https://github.com/peterjokumsen/peterjokumsen-nx-workspace.git
\`\`\`
`);

  ngOnInit(): void {
    this._logger?.to.log('Parsed markdown %o', this.markdown);
  }
}
