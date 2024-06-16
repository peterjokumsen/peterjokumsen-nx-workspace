import { ReadResult, RichContentMap } from '../_models';
import { isRichContentString, lineHas, splitRichContent } from '../helper-fns';

import { RichContentType } from '@peterjokumsen/ts-md-models';
import { matchRichContent } from './match-rich-content';

export function readParagraph(lines: string[], start: number): ReadResult {
  const contentTypes: RichContentType[] = ['image', 'link'];
  let line = lines[start];

  const richContentMap: RichContentMap = {};
  for (const type of contentTypes) {
    if (!lineHas(type, line)) continue;
    const richContentMatches = matchRichContent(type, line);
    let typeCount = 0;
    for (const { matched, content } of richContentMatches) {
      const key = `__${type}_${typeCount++}__`;
      richContentMap[key] = { matched, content };
      line = line.split(matched).join(key);
    }
  }

  if (!Object.keys(richContentMap).length) {
    return {
      content: {
        type: 'paragraph',
        content: line,
      },
      nextStart: start,
    };
  }

  for (const { content } of Object.values(richContentMap)) {
    if (content.type !== 'link') continue;
    if (!isRichContentString(content.content, richContentMap)) continue;
    content.content = splitRichContent(content.content, richContentMap);
  }

  return {
    content: {
      type: 'paragraph',
      content: splitRichContent(line, richContentMap),
    },
    nextStart: start,
  };
}
