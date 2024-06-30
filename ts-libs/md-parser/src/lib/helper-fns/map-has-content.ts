import { MarkdownContent, MarkdownType } from '@peterjokumsen/ts-md-models';

import { MatchedContentMap } from '../_models';
import { RegexContentType } from './provide-regex-tools';

/**
 * Check if the content has any of the content types in the content map.
 * @param content
 * @param contentMap
 * @returns boolean indicating if the content has any of the content types in the content map.
 */
export function mapHasContent<T extends RegexContentType>(
  content: string | MarkdownContent[] | MarkdownType<T>[],
  contentMap: MatchedContentMap<T>,
): content is string {
  if (typeof content !== 'string') return false;
  return Object.keys(contentMap).some((key) => content.includes(key));
}
