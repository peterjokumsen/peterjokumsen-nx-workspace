import {
  MdParagraphComponent,
  MdUnknownComponent,
  MdWrapperComponent,
} from './components';

import { CommonModule } from '@angular/common';
import { MdContentInjectionDirective } from './directives/md-content-injection.directive';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [CommonModule],
  declarations: [
    MdParagraphComponent,
    MdWrapperComponent,
    MdUnknownComponent,
    MdContentInjectionDirective,
  ],
  exports: [MdWrapperComponent, MdContentInjectionDirective],
})
export class MdComponentsModule {}
