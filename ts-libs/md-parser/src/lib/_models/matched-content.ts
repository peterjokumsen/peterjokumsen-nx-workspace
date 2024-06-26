import { MarkdownContentType, MarkdownType } from '@peterjokumsen/ts-md-models';

export interface MatchedContent<T extends MarkdownContentType> {
  matched: string;
  content: MarkdownType<T>;
}

export type MatchedContentMap<T extends MarkdownContentType> = Record<
  string,
  MatchedContent<T>
>;
