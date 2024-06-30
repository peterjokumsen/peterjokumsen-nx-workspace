import { SectionContentType } from '@peterjokumsen/ts-md-models';

/**
 * Gets the content type of the provided line.
 * Can be either a `'section'`, `'list'` or `'paragraph'`.
 * @param line The line to check.
 * @returns The content type of the line.
 */
export function getSectionContentType(
  line: string,
): Extract<SectionContentType, 'section' | 'list' | 'paragraph'> {
  const trimmedLine = line.trimStart();
  if (trimmedLine.startsWith('#')) {
    return 'section';
  }

  if (trimmedLine.startsWith('-')) {
    return 'list';
  }

  return 'paragraph';
}
