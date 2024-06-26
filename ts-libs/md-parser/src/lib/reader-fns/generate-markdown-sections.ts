import { MarkdownType, SectionContentType } from '@peterjokumsen/ts-md-models';

import { getSectionContentType } from '../helper-fns';
import { readList } from './read-list';
import { readParagraph } from './read-paragraph';
import { readSection } from './read-section';

export function* generateMarkdownSections(
  markdown: string,
): Generator<MarkdownType<SectionContentType>> {
  const lines = markdown.replace('\r', '').split('\n');
  let next: MarkdownType<SectionContentType>;
  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    if (line.trim() === '') continue;

    const type = getSectionContentType(line);
    switch (type) {
      case 'section': {
        const { result, nextStart } = readSection(lines, idx);
        idx = nextStart;
        next = result;
        break;
      }
      case 'list': {
        const { result, nextStart } = readList(lines, idx);
        idx = nextStart;
        next = result;
        break;
      }
      case 'paragraph': {
        const { result, nextStart } = readParagraph(lines, idx);
        idx = nextStart;
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
