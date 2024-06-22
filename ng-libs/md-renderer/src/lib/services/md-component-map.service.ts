import { HasContent, HasContentBase } from '../has-content';
import { Injectable, Type, inject } from '@angular/core';
import { MD_COMPONENT_TYPE_MAP, MdComponentTypeMap } from '../injection.tokens';
import {
  MdImageComponent,
  MdLinkComponent,
  MdParagraphComponent,
  MdTextComponent,
  MdUnknownComponent,
} from '../components';

import { MarkdownContentType } from '@peterjokumsen/ts-md-models';

@Injectable()
export class MdComponentMapService {
  private _typeMap = inject(MD_COMPONENT_TYPE_MAP, { optional: true });
  private _defaultMap: MdComponentTypeMap = {
    paragraph: MdParagraphComponent,
    image: MdImageComponent,
    text: MdTextComponent,
    link: MdLinkComponent,
  };

  getComponent<T extends MarkdownContentType>(
    type: T,
  ): Type<HasContent<T> | HasContentBase> {
    if (this._typeMap?.[type]) {
      return this._typeMap[type];
    }

    return this._defaultMap[type] ?? MdUnknownComponent;
  }
}
