import { SectionContentType } from '@peterjokumsen/ts-md-models';

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
