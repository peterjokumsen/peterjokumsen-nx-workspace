import { MarkdownContentType } from '@peterjokumsen/ts-md-models';
import { ReadResult } from './read-result';

export type ReadContentFn<T extends MarkdownContentType> = (
  lines: string[],
  start: number,
) => ReadResult<T>;
