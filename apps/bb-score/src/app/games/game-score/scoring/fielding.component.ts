import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ScoringService } from './scoring.service';

@Component({
  imports: [CommonModule, MatButton],
  template: `
    <p>Fielding</p>
    <button mat-raised-button (click)="scoring.switchState()">
      Switch state
    </button>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldingComponent {
  scoring = inject(ScoringService);
}
