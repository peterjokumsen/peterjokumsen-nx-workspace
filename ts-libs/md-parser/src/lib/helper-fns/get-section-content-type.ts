import { SectionContentType } from '@peterjokumsen/ts-md-models';

/**
 * Gets the content type of the provided line.
 * Can be either a `'section'`, `'list'`, `'commented'`, or `'paragraph'`.
 * @param line The line to check.
 * @returns The content type of the line.
 */
export function getSectionContentType(
  line: string,
): Extract<
  SectionContentType,
  'section' | 'code-block' | 'list' | 'paragraph' | 'commented' | 'quote'
> {
  const trimmedLine = line.trimStart();
  if (trimmedLine.startsWith('#')) {
    return 'section';
  }

  if (trimmedLine.startsWith('- ')) {
    return 'list';
  }

  if (trimmedLine.startsWith('```')) {
    return 'code-block';
  }

  if (trimmedLine.startsWith('<!--')) {
    return 'commented';
  }

  if (trimmedLine.startsWith('> ')) {
    return 'quote';
  }

  return 'paragraph';
}
