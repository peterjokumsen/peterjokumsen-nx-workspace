import { InjectionToken, Type } from '@angular/core';

import { HasContent } from './has-content';
import { MarkdownContentType } from '@peterjokumsen/ts-md-models';

export type MdComponentTypeMap = Record<MarkdownContentType, Type<HasContent>>;
export const MD_COMPONENT_TYPE_MAP = new InjectionToken<MdComponentTypeMap>(
  'MD_COMPONENT_TYPE_MAP',
);
