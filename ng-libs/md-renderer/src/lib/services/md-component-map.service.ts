import { HasContent, HasContentBase } from '../has-content';
import { Injectable, Type, inject } from '@angular/core';
import { MD_COMPONENT_TYPE_MAP, MdComponentTypeMap } from '../injection.tokens';
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
  MdUnknownComponent,
} from '../components';

import { ExpectedContentTypes } from '../filter-content-types';

@Injectable()
export class MdComponentMapService {
  private _typeMap = inject(MD_COMPONENT_TYPE_MAP, { optional: true });
  private _defaultMap: MdComponentTypeMap = {
    'code-block': MdCodeBlockComponent,
    'horizontal-rule': MdHorizontalRuleComponent,
    code: MdCodeComponent,
    commented: MdCommentedComponent,
    image: MdImageComponent,
    link: MdLinkComponent,
    list: MdListComponent,
    paragraph: MdParagraphComponent,
    quote: MdQuoteBlockComponent,
    section: MdSectionComponent,
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
