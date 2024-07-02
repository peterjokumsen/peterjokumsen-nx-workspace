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
import { matchTextFormatting } from './match-text-formatting';

/**
 * Content types to match in a line.
 */
type AllowedRegexTypes = Extract<ParagraphContentType, RegexContentType>;

/**
 * Injects token(s) into the line for a specific content type, when matched.
 * @param type
 * @param line
 * @param contentMap
 * @returns The line with injected tokens.
 */
function injectToken(
  type: AllowedRegexTypes,
  line: string,
  contentMap: MatchedContentMap<AllowedRegexTypes>,
): string {
  if (!lineHasContentType(type, line)) return line;
  const richContentMatches = matchParagraphContentType(type, line);
  let typeCount = 0;
  for (const { matched, content } of richContentMatches) {
    const key = `%%${type}-${typeCount++}%%`;
    contentMap[key] = { matched, content };
    line = line.split(matched).join(key);
  }
  return line;
}

/**
 * Reads a line of markdown. This function is used to read a single line of markdown and return the markdown types found in the line.
 * Will check for code, image, and link types. Followed by checking for formatting in text.
 * @param line The line to read.
 * @returns The read markdown types.
 */
export function readLine(line: string): Array<MarkdownType<AllowedRegexTypes>> {
  const contentTypes: Array<AllowedRegexTypes> = ['image', 'link'];
  const contentMap: MatchedContentMap<AllowedRegexTypes> = {};

  // prepare `code` before applying formatting.
  line = injectToken('code', line, contentMap);

  const formattingMatches = matchTextFormatting(line);
  if (formattingMatches.length) {
    let formatCount = 0;
    for (const { matched, content } of formattingMatches) {
      const key = `%%f-${formatCount++}%%`;
      contentMap[key] = { matched, content };

      if (content.format === 'line-break') {
        line = line.slice(0, -2) + key;
        continue;
      }

      line = line.split(matched).join(key);
    }
  }

  for (const type of contentTypes) {
    line = injectToken(type, line, contentMap);
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
