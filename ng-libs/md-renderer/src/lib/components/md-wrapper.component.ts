import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'pj-mdr-md-wrapper',
  template: `<ng-container #container></ng-container>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdWrapperComponent {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;
}
