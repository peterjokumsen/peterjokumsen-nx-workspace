import { MD_COMPONENT_TYPE_MAP, MdComponentTypeMap } from './injection.tokens';
import {
  MdCodeComponent,
  MdHorizontalRuleComponent,
  MdImageComponent,
  MdLinkComponent,
  MdListComponent,
  MdParagraphComponent,
  MdSectionComponent,
  MdTextComponent,
  MdTitleComponent,
  MdUnknownComponent,
  MdWrapperComponent,
} from './components';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MdContentInjectionDirective } from './directives/md-content-injection.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    MdContentInjectionDirective,

    MdCodeComponent,
    MdHorizontalRuleComponent,
    MdImageComponent,
    MdLinkComponent,
    MdListComponent,
    MdParagraphComponent,
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
