import {
  MarkdownSection,
  SectionContentType,
} from '@peterjokumsen/ts-md-models';
import { getHeaderLevel, getSectionContentType } from '../helper-fns';

import { ReadResult } from '../_models';
import { readCodeBlock } from './read-code-block';
import { readCommentedBlock } from './read-commented-block';
import { readList } from './read-list';
import { readParagraph } from './read-paragraph';

/**
 * Reads a section starting from the specified start index in the provided lines from markdown file.
 * Will read until the next section of the same or lower header level is found.
 *
 * If a section is found, and the header level is higher than the current section, it will read the section and add it to the contents of the current section.
 * If a list is found, it will read the list and add it to the contents of the current section.
 * If a paragraph is found, it will read the paragraph and add it to the contents of the current section.
 *
 * If the content type is not supported, an error will be thrown.
 *
 * @param lines
 * @param start
 * @returns ReadResult<SectionContentType>
 */
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
          return { result: section, lastLineIndex: i - 1 };
        }

        const { result, lastLineIndex } = readSection(lines, i);
        section.contents.push(result);
        i = lastLineIndex;
        break;
      }
      case 'list': {
        const { result, lastLineIndex } = readList(lines, i);
        section.contents.push(result);
        i = lastLineIndex;
        break;
      }
      case 'paragraph': {
        const { result, lastLineIndex } = readParagraph(lines, i);
        section.contents.push(result);
        i = lastLineIndex;
        break;
      }
      case 'code-block': {
        const { result, lastLineIndex } = readCodeBlock(lines, i);
        section.contents.push(result);
        i = lastLineIndex;
        break;
      }
      case 'commented': {
        const { result, lastLineIndex } = readCommentedBlock(lines, i);
        section.contents.push(result);
        i = lastLineIndex;
        break;
      }

      default:
        throw new Error(
          `Content type: "${type}" not supported, attempting to read line ${i}: "${line}"`,
        );
    }
  }

  return { result: section, lastLineIndex: i - 1 };
}
