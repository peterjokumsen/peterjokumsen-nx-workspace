import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'pj-mdr-md-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `<p>md-renderer works!</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdRendererComponent {}
