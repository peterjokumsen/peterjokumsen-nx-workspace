import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-styles',
  standalone: true,
  imports: [CommonModule],
  template: `<p>styles works!</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StylesComponent {}
