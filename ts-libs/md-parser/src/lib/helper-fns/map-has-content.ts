import { MarkdownContent, MarkdownType } from '@peterjokumsen/ts-md-models';

import { MatchedContentMap } from '../_models';
import { RegexContentType } from './provide-regex-tools';

export function mapHasContent<T extends RegexContentType>(
  content: string | MarkdownContent[] | MarkdownType<T>[],
  contentMap: MatchedContentMap<T>,
): content is string {
  if (typeof content !== 'string') return false;
  return Object.keys(contentMap).some((key) => content.includes(key));
}
