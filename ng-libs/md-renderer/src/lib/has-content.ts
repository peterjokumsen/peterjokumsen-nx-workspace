import {
  MarkdownContent,
  MarkdownContentType,
  MarkdownType,
} from '@peterjokumsen/ts-md-models';

import { WithId } from './models';

export interface HasContentBase {
  content: string | MarkdownContent | WithId<MarkdownContent>;
}

export interface HasContent<T extends MarkdownContentType>
  extends HasContentBase {
  content: string | WithId<MarkdownType<T>> | MarkdownType<T>;
}
