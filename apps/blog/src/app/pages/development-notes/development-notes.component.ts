import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { PageIntroductionComponent } from '@peterjokumsen/ui-elements';
import { DisplayMarkdownComponent } from '../../components';

@Component({
  imports: [CommonModule, PageIntroductionComponent, DisplayMarkdownComponent],
  templateUrl: './development-notes.component.html',
  styleUrl: './development-notes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopmentNotesComponent {}
