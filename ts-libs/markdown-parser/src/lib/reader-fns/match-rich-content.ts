import { MarkdownContent, RichContentType } from '../models';

import { MatchedContent } from '../_models';
import { regexPatterns } from '../helper-fns/regex-patterns';

export function matchRichContent(
  type: RichContentType,
  rawContent: string,
): MatchedContent[] {
  const pattern = regexPatterns[type];
  const result: MatchedContent[] = [];
  if (!pattern) {
    return result;
  }

  const matches = rawContent.matchAll(new RegExp(pattern, 'g'));
  if (!matches) {
    return result;
  }

  for (const match of matches) {
    const [matched, first, second] = match ?? ['', '', ''];
    if (!matched || result.some(({ matched: found }) => found === matched))
      continue;

    let content: MarkdownContent;
    switch (type) {
      case 'image':
        content = {
          type: 'image',
          alt: first,
          src: second,
        };
        break;
      case 'link':
        content = {
          type: 'link',
          content: first,
          href: second,
        };
        break;
      default:
        throw new Error(
          `Unknown type '${type}' specified for matchRichContent`,
        );
    }
    result.push({ matched, content });
  }

  return result;
}
