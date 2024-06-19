import { MarkdownContent } from '@peterjokumsen/ts-md-models';
import { WithId } from './models';

export interface HasContent {
  content: string | WithId<MarkdownContent> | MarkdownContent;
}
