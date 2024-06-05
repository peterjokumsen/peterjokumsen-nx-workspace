import { MarkdownContent, RichContentType } from '../models';
import { MatchedContent, ReadResult } from '../_models';
import { lineHas, splitRichContent } from '../helper-fns';

import { matchRichContent } from './match-rich-content';

export function readParagraph(lines: string[], start: number): ReadResult {
  let line = lines[start];
  if (!lineHas('image', line) && !lineHas('link', line)) {
    return {
      content: {
        type: 'paragraph',
        content: line,
      },
      nextStart: start,
    };
  }

  const content: MarkdownContent[] = [];
  const richContent: { [key: string]: MatchedContent } = {};
  const contentTypes: RichContentType[] = ['image', 'link'];
  for (const type of contentTypes) {
    const richContentMatches = matchRichContent(type, line);
    let typeCount = 0;
    for (const { matched, content } of richContentMatches) {
      const key = `__${type}_${typeCount++}__`;
      richContent[key] = { matched, content };
      line = line.replace(new RegExp(`(${matched})`, 'g'), key);
    }
  }

  for (const { content } of Object.values(richContent)) {
    if (content.type !== 'link' || Array.isArray(content.content)) continue;
    content.content = splitRichContent(content.content, richContent);
  }

  return {
    content: {
      type: 'paragraph',
      content: splitRichContent(line, richContent),
    },
    nextStart: start,
  };
}
