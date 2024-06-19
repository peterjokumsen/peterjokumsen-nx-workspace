import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'pj-mdr-md-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-container #container></ng-container>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdWrapperComponent {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;
}
