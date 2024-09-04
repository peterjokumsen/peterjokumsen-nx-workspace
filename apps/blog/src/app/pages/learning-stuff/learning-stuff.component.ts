import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-learning-stuff',
  standalone: true,
  imports: [CommonModule],
  template: `<p>learning-stuff works!</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningStuffComponent {}
