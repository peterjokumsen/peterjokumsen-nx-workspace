import { HasContent, HasContentBase } from '../has-content';
import { Injectable, Type, inject } from '@angular/core';
import { MD_COMPONENT_TYPE_MAP, MdComponentTypeMap } from '../injection.tokens';
import {
  MdCodeComponent,
  MdHorizontalRuleComponent,
  MdImageComponent,
  MdLinkComponent,
  MdListComponent,
  MdParagraphComponent,
  MdTextComponent,
  MdUnknownComponent,
} from '../components';

import { ExpectedContentTypes } from '../filter-content-types';

@Injectable()
export class MdComponentMapService {
  private _typeMap = inject(MD_COMPONENT_TYPE_MAP, { optional: true });
  private _defaultMap: MdComponentTypeMap = {
    'horizontal-rule': MdHorizontalRuleComponent,
    code: MdCodeComponent,
    image: MdImageComponent,
    link: MdLinkComponent,
    list: MdListComponent,
    paragraph: MdParagraphComponent,
    section: MdParagraphComponent, // TODO: need to create MdSectionComponent (cater for sub-sections)
    text: MdTextComponent,
  };

  getComponent<T extends ExpectedContentTypes>(
    type: T,
  ): Type<HasContent<T> | HasContentBase> {
    if (this._typeMap) {
      if (type in this._typeMap)
        return this._typeMap[type] ?? MdUnknownComponent;
      if (this._typeMap.fallback) return this._typeMap.fallback;
    }

    return this._defaultMap[type] ?? MdUnknownComponent;
  }
}
