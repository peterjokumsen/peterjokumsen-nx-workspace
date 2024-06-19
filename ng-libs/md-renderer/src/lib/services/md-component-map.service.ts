import { Injectable, Type } from '@angular/core';
import { MdParagraphComponent, MdUnknownComponent } from '../components';

import { HasContent } from '../has-content';
import { MarkdownContentType } from '@peterjokumsen/ts-md-models';

@Injectable()
export class MdComponentMapService {
  getComponent(type: MarkdownContentType): Type<HasContent> {
    switch (type) {
      case 'paragraph':
        return MdParagraphComponent;

      default:
        return MdUnknownComponent;
    }
  }
}
