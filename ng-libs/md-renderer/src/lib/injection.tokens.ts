import { InjectionToken, Type } from '@angular/core';
import { HasContent, HasContentBase } from './has-content';

import { ExpectedContentTypes } from './filter-content-types';

export type MdComponentTypeMap = Record<
  ExpectedContentTypes,
  Type<HasContent<ExpectedContentTypes>>
>;

export const MD_COMPONENT_TYPE_MAP = new InjectionToken<
  Partial<MdComponentTypeMap & { fallback: Type<HasContentBase> }>
>('MD_COMPONENT_TYPE_MAP');
