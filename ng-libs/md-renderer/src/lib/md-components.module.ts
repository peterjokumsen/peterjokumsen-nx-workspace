import { MD_COMPONENT_TYPE_MAP, MdComponentTypeMap } from './injection.tokens';
import {
  MdCodeComponent,
  MdImageComponent,
  MdLinkComponent,
  MdListComponent,
  MdParagraphComponent,
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
    MdImageComponent,
    MdLinkComponent,
    MdListComponent,
    MdParagraphComponent,
    MdTextComponent,
    MdTitleComponent,
    MdUnknownComponent,
    MdWrapperComponent,

    MdContentInjectionDirective,
    MdCodeComponent,
  ],
  exports: [MdContentInjectionDirective, MdWrapperComponent],
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
