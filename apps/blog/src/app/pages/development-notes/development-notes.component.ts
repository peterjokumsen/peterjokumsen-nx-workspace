import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ChangeHistoryComponent } from '../../components/change-history';
import { CommonModule } from '@angular/common';
import { PageIntroductionComponent } from '@peterjokumsen/ui-elements';

@Component({
  standalone: true,
  imports: [CommonModule, PageIntroductionComponent, ChangeHistoryComponent],
  templateUrl: './development-notes.component.html',
  styleUrl: './development-notes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopmentNotesComponent {}
