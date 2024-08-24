import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PjLogger, PjMarkdownClient } from '@peterjokumsen/ng-services';

import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MdRendererComponent } from '@peterjokumsen/md-renderer';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [
    CommonModule,
    FaIconComponent,
    MdRendererComponent,
    MatProgressSpinner,
  ],
  template: `
    @if (markdown()) {
      <pj-mdr-md-renderer [parsedContent]="markdown()"></pj-mdr-md-renderer>
    } @else {
      <div class="loading">
        @defer {
          <mat-progress-spinner [mode]="'indeterminate'"></mat-progress-spinner>
        } @placeholder {
          <p>Loading...</p>
        }
      </div>
    }
  `,
  styleUrl: 'about-me.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutMeComponent {
  private _logger = inject(PjLogger, { optional: true });
  private _mdClient = inject(PjMarkdownClient);

  markdown = toSignal(this._mdClient.readMarkdown('assets/docs/about-me.md'));
}
