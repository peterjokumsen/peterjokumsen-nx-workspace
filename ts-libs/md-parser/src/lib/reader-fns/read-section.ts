import {
  MarkdownSection,
  SectionContentType,
} from '@peterjokumsen/ts-md-models';
import { getHeaderLevel, getSectionContentType } from '../helper-fns';

import { ReadResult } from '../_models';
import { readList } from './read-list';
import { readParagraph } from './read-paragraph';

export function readSection(
  lines: string[],
  start: number,
): ReadResult<SectionContentType> {
  const currentHeaderLevel = getHeaderLevel(lines[start]);
  const section: MarkdownSection = {
    type: 'section',
    title: lines[start].replace(/#+/, '').trim(),
    contents: [],
  };

  let i = start + 1;
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') {
      continue;
    }

    const type = getSectionContentType(line);
    switch (type) {
      case 'section': {
        if (currentHeaderLevel >= getHeaderLevel(line)) {
          return { result: section, nextStart: i - 1 };
        }

        const { result, nextStart } = readSection(lines, i);
        section.contents.push(result);
        i = nextStart;
        break;
      }
      case 'list': {
        const { result, nextStart } = readList(lines, i);
        section.contents.push(result);
        i = nextStart;
        break;
      }
      case 'paragraph': {
        const { result, nextStart } = readParagraph(lines, i);
        section.contents.push(result);
        i = nextStart;
        break;
      }

      default:
        throw new Error(
          `Content type: "${type}" not supported, attempting to read line ${i}: "${line}"`,
        );
    }
  }

  return { result: section, nextStart: i - 1 };
}
