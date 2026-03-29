import {
  MarkdownMetaData,
  MarkdownType,
  SectionContentType,
} from '@peterjokumsen/ts-md-models';

import { getSectionContentType } from '../helper-fns';
import { readMetadata } from './read-frontmatter';
import { readList } from './read-list';
import { readParagraph } from './read-paragraph';
import { readQuote } from './read-quote';
import { readSection } from './read-section';

/**
 * Generates markdown sections from the provided markdown string.
 * Splits the markdown string into lines an reads each line to determine the content type.
 * Will yield the next markdown section until the end of the markdown string is reached.
 * @param markdown
 * @returns Generator of markdown sections.
 */
export function* generateMarkdownSections(
  markdown: string,
): Generator<MarkdownType<SectionContentType> | MarkdownMetaData> {
  const lines = markdown.replace('\r', '').split('\n');
  let next: MarkdownType<SectionContentType>;
  let start = -1;
  if (lines[0].trim() === '---') {
    // initial `---` is frontmatter
    const { result, lastLineIndex } = readMetadata(lines, 0);
    start = lastLineIndex;
    yield result;
  }

  for (let idx = start + 1; idx < lines.length; idx++) {
    const line = lines[idx];
    if (line.trim() === '') continue;

    const type = getSectionContentType(line);
    switch (type) {
      case 'section': {
        const { result, lastLineIndex } = readSection(lines, idx);
        idx = lastLineIndex;
        next = result;
        break;
      }
      case 'list': {
        const { result, lastLineIndex } = readList(lines, idx);
        idx = lastLineIndex;
        next = result;
        break;
      }
      case 'paragraph': {
        const { result, lastLineIndex } = readParagraph(lines, idx);
        idx = lastLineIndex;
        next = result;
        break;
      }
      case 'quote': {
        const { result, lastLineIndex } = readQuote(lines, idx);
        idx = lastLineIndex;
        next = result;
        break;
      }
      default: {
        throw new Error(
          `Content type: "${type}" not supported. Reading line ${idx} "${line}"`,
        );
      }
    }

    yield next;
  }
}
