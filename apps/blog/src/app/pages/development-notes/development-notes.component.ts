import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './development-notes.component.html',
  styleUrl: './development-notes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopmentNotesComponent {}
