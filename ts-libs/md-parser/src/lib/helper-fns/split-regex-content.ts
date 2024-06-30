import { MarkdownText, MarkdownType } from '@peterjokumsen/ts-md-models';

import { MatchedContentMap } from '../_models';
import { RegexContentType } from './provide-regex-tools';

/**
 * Replace tokens in content with parsed content from the content map.
 * Otherwise, return the string content as a text type.
 * @param rawContent - The raw content to split.
 * @param richContentMap - The map of rich content to used in place of tokens in rawContent.
 * @returns The split content.
 */
export function splitRegexContent<T extends RegexContentType>(
  rawContent: string,
  richContentMap: MatchedContentMap<T>,
): (MarkdownText | MarkdownType<T>)[] {
  const result: (MarkdownText | MarkdownType<T>)[] = [];
  const contentKeys = Object.keys(richContentMap).join('|');
  for (const split of rawContent.split(new RegExp(`(${contentKeys})`))) {
    if (!split) continue;
    if (split in richContentMap) {
      result.push(richContentMap[split].content);
    } else {
      result.push({ type: 'text', content: split });
    }
  }

  return result;
}
