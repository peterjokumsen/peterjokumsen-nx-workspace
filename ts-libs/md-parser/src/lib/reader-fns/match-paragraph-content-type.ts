import { RegexContentType, provideRegexTools } from '../helper-fns';

import { MatchedContent } from '../_models';

/**
 * @template T The type of content to match.
 * @param {T} type Value to infer the type to be matched.
 * @param rawContent The raw content to match.
 * @returns {MatchedContent<T>[]} The matched string and the parsed content.
 */
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
