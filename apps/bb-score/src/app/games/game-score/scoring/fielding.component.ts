import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ScoringService } from './scoring.service';

@Component({
  imports: [CommonModule, MatButton],
  template: `
    <button mat-raised-button (click)="scoring.updateState({ type: 'foul' })">
      Foul
    </button>
    <button
      mat-raised-button
      (click)="scoring.updateState({ type: 'home-run' })"
    >
      Home Run
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
export class FieldingComponent {
  scoring = inject(ScoringService);
}
