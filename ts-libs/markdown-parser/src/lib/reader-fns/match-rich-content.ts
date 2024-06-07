import { regexContentFns, regexPatterns } from '../helper-fns';

import { MatchedContent } from '../_models';
import { RichContentType } from '../models';

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
    const { matched, content } = regexContentFns[type](match);
    if (!matched || result.some(({ matched: found }) => found === matched)) {
      continue;
    }

    result.push({ matched, content });
  }

  return result;
}
