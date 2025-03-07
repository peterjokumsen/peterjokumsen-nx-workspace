import { BehaviorSubject, switchMap } from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { PjLogger, PjMarkdownClient } from '@peterjokumsen/ng-services';

import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MdRendererComponent } from '@peterjokumsen/md-renderer';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-display-markdown',
  imports: [
    CommonModule,
    FaIconComponent,
    MdRendererComponent,
    MatProgressSpinner,
  ],
  template: `
    @if (markdown(); as markdown) {
      <pj-mdr-md-renderer [parsedContent]="markdown"></pj-mdr-md-renderer>
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
  styleUrl: 'display-markdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayMarkdownComponent {
  private _filePathSubject = new BehaviorSubject<string>('');
  private _logger = inject(PjLogger, { optional: true });
  private _mdClient = inject(PjMarkdownClient);

  @Input()
  set filePath(value: string) {
    this._filePathSubject.next(value);
  }

  markdown = toSignal(
    this._filePathSubject.pipe(
      switchMap((path) => {
        if (!path) return [undefined];
        return this._mdClient.readMarkdown(path);
      }),
    ),
  );
}
