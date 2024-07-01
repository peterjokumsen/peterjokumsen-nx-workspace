import {
  MarkdownType,
  ParagraphContentType,
} from '@peterjokumsen/ts-md-models';
import {
  RegexContentType,
  lineHasContentType,
  mapHasContent,
  splitRegexContent,
} from '../helper-fns';

import { MatchedContentMap } from '../_models';
import { matchParagraphContentType } from './match-paragraph-content-type';

/**
 * Content types to match in a line.
 */
type AllowedRegexTypes = Extract<ParagraphContentType, RegexContentType>;

/**
 * Reads a line of markdown. This function is used to read a single line of markdown and return the markdown types found in the line.
 * Will check for code, image, and link types. Followed by checking for formatting in text.
 * @param line The line to read.
 * @returns The read markdown types.
 */
export function readLine(line: string): Array<MarkdownType<AllowedRegexTypes>> {
  const contentTypes: Array<AllowedRegexTypes> = ['code', 'image', 'link'];
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
    return [
      {
        type: 'text',
        content: line,
      },
    ];
  }

  for (const { content } of Object.values(contentMap)) {
    if (content.type !== 'link') continue;
    if (!mapHasContent(content.content, contentMap)) continue;
    content.content = splitRegexContent(content.content, contentMap);
  }

  return splitRegexContent(line, contentMap);
}
