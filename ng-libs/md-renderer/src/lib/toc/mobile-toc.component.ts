import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';

import { CommonModule } from '@angular/common';
import { MarkdownSection } from '@peterjokumsen/ts-md-models';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TableOfContentsComponent } from './table-of-contents.component';
import { WithId } from '../models';

@Component({
  selector: 'pj-mdr-mobile-toc',
  standalone: true,
  imports: [CommonModule, TableOfContentsComponent, MatFabButton, MatIcon],
  animations: [
    trigger('showHide', [
      transition(':enter', [
        animate(
          '300ms ease-in',
          keyframes([
            style({ offset: 0, opacity: 0 }),
            style({ offset: 1, opacity: 1 }),
          ]),
        ),
      ]),
      transition(':leave', [
        animate(
          '500ms ease-out',
          keyframes([
            style({ offset: 0, opacity: 1 }),
            style({ offset: 1, opacity: 0 }),
          ]),
        ),
      ]),
    ]),
  ],
  template: `
    @if (expanded()) {
      <div @showHide class="toc">
        <pj-mdr-table-of-contents
          [sections]="sections()"
          [inViewSectionId]="inViewSectionId()"
          (sectionClick)="onSectionClicked($event)"
        ></pj-mdr-table-of-contents>
      </div>
    }
    <div class="nav-toggle">
      <button
        mat-fab
        color="primary"
        (click)="navToggle()"
        [attr.aria-label]="'Expand table of contents'"
      >
        <mat-icon>menu</mat-icon>
      </button>
    </div>
  `,
  styles: `
    .nav-toggle {
      margin: 1rem;
      float: right;
    }

    .toc {
      max-height: calc(100vh - 6rem);
      overflow-y: auto;
      max-width: 400px;
      border-radius: 10px;
      padding: 1rem;
      background-color: rgba(0, 0, 0, 0.5);
      margin-top: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileTocComponent {
  expanded = signal(false);
  sections = input<WithId<MarkdownSection>[]>([]);
  inViewSectionId = input<string>();
  sectionClick = output<string>();

  navToggle() {
    this.expanded.update((v) => !v);
  }

  onSectionClicked(sectionId: string) {
    this.expanded.update(() => false);
    this.sectionClick.emit(sectionId);
  }
}
