import { Injectable, Type, inject } from '@angular/core';
import {
  MdImageComponent,
  MdLinkComponent,
  MdParagraphComponent,
  MdTextComponent,
  MdUnknownComponent,
} from '../components';

import { HasContent } from '../has-content';
import { MD_COMPONENT_TYPE_MAP } from '../injection.tokens';
import { MarkdownContentType } from '@peterjokumsen/ts-md-models';

@Injectable()
export class MdComponentMapService {
  private _typeMap = inject(MD_COMPONENT_TYPE_MAP, { optional: true });
  getComponent(type: MarkdownContentType): Type<HasContent> {
    if (this._typeMap?.[type]) {
      return this._typeMap[type];
    }

    switch (type) {
      case 'paragraph':
        return MdParagraphComponent;

      case 'image':
        return MdImageComponent;

      case 'text':
        return MdTextComponent;

      case 'link':
        return MdLinkComponent;

      default:
        return MdUnknownComponent;
    }
  }
}
