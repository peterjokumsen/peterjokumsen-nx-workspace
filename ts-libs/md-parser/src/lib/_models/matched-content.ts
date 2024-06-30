import { MarkdownContentType, MarkdownType } from '@peterjokumsen/ts-md-models';

/**
 * Represents matched content in a line of markdown.
 */
export interface MatchedContent<T extends MarkdownContentType> {
  /**
   * The matched content in the line.
   * e.g. `![alt text](url)`
   */
  matched: string;
  /**
   * The parsed content of the matched content.
   */
  content: MarkdownType<T>;
}

/**
 * Represents a map of matched content in a line of markdown.
 */
export type MatchedContentMap<T extends MarkdownContentType> = Record<
  string,
  MatchedContent<T>
>;
