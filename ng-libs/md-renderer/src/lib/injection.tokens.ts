import { HasContent, HasContentBase } from './has-content';
import { InjectionToken, Type } from '@angular/core';

import { MarkdownContentType } from '@peterjokumsen/ts-md-models';

export type MdComponentTypeMap =
  | Record<MarkdownContentType, Type<HasContent<MarkdownContentType>>>
  | { [key: string]: Type<HasContentBase> };

export const MD_COMPONENT_TYPE_MAP = new InjectionToken<MdComponentTypeMap>(
  'MD_COMPONENT_TYPE_MAP',
);
