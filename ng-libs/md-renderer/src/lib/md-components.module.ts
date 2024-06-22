import { MD_COMPONENT_TYPE_MAP, MdComponentTypeMap } from './injection.tokens';
import {
  MdImageComponent,
  MdLinkComponent,
  MdParagraphComponent,
  MdTextComponent,
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
