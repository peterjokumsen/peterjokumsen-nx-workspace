import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'pj-ui-page-introduction',
  standalone: true,
  imports: [CommonModule],
  template: `<p>page-introduction works!</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageIntroductionComponent {}
