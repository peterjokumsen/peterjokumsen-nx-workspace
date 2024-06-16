import { MarkdownContent } from '@peterjokumsen/ts-md-models';

export interface ReadResult {
  content: MarkdownContent;
  nextStart: number;
}
