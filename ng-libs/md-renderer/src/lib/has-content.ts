import { MarkdownContent, MarkdownType } from '@peterjokumsen/ts-md-models';

import { ExpectedContentTypes } from './filter-content-types';
import { WithId } from './models';

export interface HasContentBase {
  content: string | MarkdownContent | WithId<MarkdownContent>;
}

export interface HasContent<T extends ExpectedContentTypes>
  extends HasContentBase {
  content: string | WithId<MarkdownType<T>> | MarkdownType<T>;
}
