import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-score-status',
  standalone: true,
  imports: [CommonModule],
  template: `<p>score status works!</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreStatusComponent {}
