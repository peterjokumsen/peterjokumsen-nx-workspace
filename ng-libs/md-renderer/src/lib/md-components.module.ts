import {
  MdImageComponent,
  MdParagraphComponent,
  MdUnknownComponent,
  MdWrapperComponent,
} from './components';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HasContent } from './has-content';
import { MD_COMPONENT_TYPE_MAP } from './injection.tokens';
import { MarkdownContentType } from '@peterjokumsen/ts-md-models';
import { MdContentInjectionDirective } from './directives/md-content-injection.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    MdImageComponent,
    MdParagraphComponent,
    MdWrapperComponent,
    MdUnknownComponent,
    MdContentInjectionDirective,
  ],
  exports: [MdWrapperComponent, MdContentInjectionDirective],
})
export class MdComponentsModule {
  static withOverride(
    typeMap: Record<MarkdownContentType, Type<HasContent>>,
  ): ModuleWithProviders<MdComponentsModule> {
    return {
      ngModule: MdComponentsModule,
      providers: [{ provide: MD_COMPONENT_TYPE_MAP, useValue: typeMap }],
    };
  }
}
