import { RegexContentType, provideRegexTools } from '../helper-fns';

import { MatchedContent } from '../_models';

export function matchParagraphContentType<T extends RegexContentType>(
  type: T,
  rawContent: string,
): MatchedContent<T>[] {
  const tools = provideRegexTools(type);
  const pattern = tools.regex;
  const result: MatchedContent<T>[] = [];
  if (!pattern) {
    return result;
  }

  const matches = rawContent.matchAll(new RegExp(pattern, 'g'));
  if (!matches) {
    return result;
  }

  for (const match of matches) {
    const { matched, content } = tools.contentFn(match);
    if (!matched || result.some(({ matched: found }) => found === matched)) {
      continue;
    }

    result.push({ matched, content });
  }

  return result;
}
