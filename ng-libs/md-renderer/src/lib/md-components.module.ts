import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  MdCodeBlockComponent,
  MdCodeComponent,
  MdCommentedComponent,
  MdHorizontalRuleComponent,
  MdImageComponent,
  MdLinkComponent,
  MdListComponent,
  MdParagraphComponent,
  MdQuoteBlockComponent,
  MdSectionComponent,
  MdTextComponent,
  MdTitleComponent,
  MdUnknownComponent,
  MdWrapperComponent,
} from './components';
import { MD_COMPONENT_TYPE_MAP, MdComponentTypeMap } from './injection.tokens';

import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MdContentInjectionDirective } from './directives/md-content-injection.directive';

@NgModule({
  imports: [CommonModule, MatIcon],
  declarations: [
    MdContentInjectionDirective,

    MdCodeComponent,
    MdCodeBlockComponent,
    MdCommentedComponent,
    MdHorizontalRuleComponent,
    MdImageComponent,
    MdLinkComponent,
    MdListComponent,
    MdParagraphComponent,
    MdQuoteBlockComponent,
    MdSectionComponent,
    MdTextComponent,
    MdTitleComponent,
    MdUnknownComponent,
    MdWrapperComponent,
  ],
  exports: [
    MdContentInjectionDirective,
    MdSectionComponent,
    MdWrapperComponent,
  ],
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
