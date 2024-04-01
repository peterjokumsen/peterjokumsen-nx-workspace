import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'pj-ui-ui-elements',
  standalone: true,
  imports: [CommonModule],
  template: `<p>ui-elements works!</p>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiElementsComponent {}
