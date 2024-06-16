import { MarkdownContentType } from '@peterjokumsen/ts-md-models';
import { ReadContentFn } from '../_models';
import { readParagraph } from './read-paragraph';
import { readSection } from './read-section';

export const contentReaders: Partial<
  Record<MarkdownContentType, ReadContentFn>
> = {
  section: readSection,
  paragraph: readParagraph,
};
