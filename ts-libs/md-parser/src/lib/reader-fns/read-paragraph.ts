import { MatchedContentMap, ReadResult } from '../_models';
import {
  RegexContentType,
  lineHasContentType,
  mapHasContent,
  splitRegexContent,
} from '../helper-fns';

import { ParagraphContentType } from '@peterjokumsen/ts-md-models';
import { matchParagraphContentType } from './match-paragraph-content-type';

type AllowedRegexTypes = Extract<ParagraphContentType, RegexContentType>;

export function readParagraph(
  lines: string[],
  start: number,
): ReadResult<'paragraph'> {
  const contentTypes: Array<AllowedRegexTypes> = ['image', 'link'];
  let line = lines[start];

  const contentMap: MatchedContentMap<AllowedRegexTypes> = {};
  for (const type of contentTypes) {
    if (!lineHasContentType(type, line)) continue;
    const richContentMatches = matchParagraphContentType(type, line);
    let typeCount = 0;
    for (const { matched, content } of richContentMatches) {
      const key = `__${type}_${typeCount++}__`;
      contentMap[key] = { matched, content };
      line = line.split(matched).join(key);
    }
  }

  if (!Object.keys(contentMap).length) {
    return {
      result: {
        type: 'paragraph',
        content: line,
      },
      nextStart: start,
    };
  }

  for (const { content } of Object.values(contentMap)) {
    if (content.type !== 'link') continue;
    if (!mapHasContent(content.content, contentMap)) continue;
    content.content = splitRegexContent(content.content, contentMap);
  }

  return {
    result: {
      type: 'paragraph',
      content: splitRegexContent(line, contentMap),
    },
    nextStart: start,
  };
}
