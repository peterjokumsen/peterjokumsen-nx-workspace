import { getContentType, getHeaderLevel } from '../helper-fns';

import { MarkdownSection } from '../models';
import { ReadResult } from '../_models';
import { contentReaders } from './content-readers';

export function readSection(lines: string[], start: number): ReadResult {
  const currentHeaderLevel = getHeaderLevel(lines[start]);
  const section: MarkdownSection = {
    type: 'section',
    title: lines[start].replace(/#+/, '').trim(),
    content: [],
  };

  let i = start + 1;
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') {
      continue;
    }

    const type = getContentType(line);
    switch (type) {
      case 'section': {
        if (currentHeaderLevel >= getHeaderLevel(line)) {
          return { content: section, nextStart: i - 1 };
        }

        const { content, nextStart } = readSection(lines, i);
        section.content.push(content);
        i = nextStart;
        break;
      }

      default: {
        const reader = contentReaders[type];
        if (!reader) {
          throw new Error(
            `No reader found for content type: "${type}", Line: "${line}":${i}`,
          );
        }
        const { content, nextStart } = reader(lines, i);
        section.content.push(content);
        i = nextStart;
      }
    }
  }

  return { content: section, nextStart: i - 1 };
}
