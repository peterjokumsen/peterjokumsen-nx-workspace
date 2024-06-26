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
import { MdCodeComponent } from './components/md-code.component';
import { MdContentInjectionDirective } from './directives/md-content-injection.directive';
import { MdListComponent } from './components/md-list.component';
import { MdTitleComponent } from './components/md-title.component';

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
