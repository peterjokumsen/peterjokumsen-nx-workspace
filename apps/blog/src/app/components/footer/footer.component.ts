import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { PjTheme } from '@peterjokumsen/ng-services';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  providers: [],
  template: `
    <footer>
      <p>&copy; 2024 Peter Jokumsen. All rights reserved.</p>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
