import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PjLogger, PjMarkdownClient } from '@peterjokumsen/ng-services';

import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MdRendererComponent } from '@peterjokumsen/md-renderer';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [CommonModule, FaIconComponent, MdRendererComponent],
  template: `
    <pj-mdr-md-renderer [parsedContent]="markdown()"></pj-mdr-md-renderer>
  `,
  styleUrl: 'about-me.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutMeComponent {
  private _logger = inject(PjLogger, { optional: true });
  private _mdClient = inject(PjMarkdownClient);

  markdown = toSignal(this._mdClient.readMarkdown('assets/docs/about-me.md'));
}
