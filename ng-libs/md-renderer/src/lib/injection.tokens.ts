import { HasContent, HasContentBase } from './has-content';
import { InjectionToken, Type } from '@angular/core';

import { ExpectedContentTypes } from './expected-content-types';

export type MdComponentTypeMap =
  | Record<ExpectedContentTypes, Type<HasContent<ExpectedContentTypes>>>
  | { [key: string]: Type<HasContentBase> };

export const MD_COMPONENT_TYPE_MAP = new InjectionToken<MdComponentTypeMap>(
  'MD_COMPONENT_TYPE_MAP',
);
