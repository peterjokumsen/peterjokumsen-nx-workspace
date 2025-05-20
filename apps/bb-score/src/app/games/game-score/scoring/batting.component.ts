import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ScoringService } from './scoring.service';

@Component({
  imports: [CommonModule, MatButton],
  template: `
    <button mat-raised-button (click)="scoring.updateState({ type: 'ball' })">
      Ball
    </button>
    <button mat-raised-button (click)="scoring.updateState({ type: 'strike' })">
      Strike
    </button>
    <button mat-raised-button (click)="scoring.updateState({ type: 'hit' })">
      Hit
    </button>
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BattingComponent {
  scoring = inject(ScoringService);
}
