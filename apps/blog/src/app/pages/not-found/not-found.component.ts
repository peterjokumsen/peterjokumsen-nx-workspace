import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `<p>not-found works!</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
