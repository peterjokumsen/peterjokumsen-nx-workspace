import { MarkdownContentType, MarkdownType } from '@peterjokumsen/ts-md-models';

export interface ReadResult<T extends MarkdownContentType> {
  result: MarkdownType<T>;
  nextStart: number;
  lastLineIndex: number;
}
