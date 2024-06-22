import { MD_COMPONENT_TYPE_MAP, MdComponentTypeMap } from './injection.tokens';
import {
  MdImageComponent,
  MdLinkComponent,
  MdParagraphComponent,
  MdTextComponent,
  MdUnknownComponent,
  MdWrapperComponent,
} from './components';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HasContent } from './has-content';
import { MarkdownContentType } from '@peterjokumsen/ts-md-models';
import { MdContentInjectionDirective } from './directives/md-content-injection.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    MdImageComponent,
    MdLinkComponent,
    MdParagraphComponent,
    MdTextComponent,
    MdUnknownComponent,
    MdWrapperComponent,

    MdContentInjectionDirective,
  ],
  exports: [MdWrapperComponent, MdContentInjectionDirective],
})
export class MdComponentsModule {
  static withOverride(
    typeMap: Partial<MdComponentTypeMap>,
  ): ModuleWithProviders<MdComponentsModule> {
    return {
      ngModule: MdComponentsModule,
      providers: [{ provide: MD_COMPONENT_TYPE_MAP, useValue: typeMap }],
    };
  }
}
