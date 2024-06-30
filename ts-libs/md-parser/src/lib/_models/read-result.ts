import { MarkdownContentType, MarkdownType } from '@peterjokumsen/ts-md-models';

/**
 * The result of reading a type from a markdown file.
 */
export interface ReadResult<T extends MarkdownContentType> {
  /**
   * The result of reading the markdown type.
   */
  result: MarkdownType<T>;

  /**
   * The index of the last line read.
   */
  lastLineIndex: number;
}
