import { MarkdownContentType, MarkdownType } from '@peterjokumsen/ts-md-models';

import { ExpectedContentTypes } from './expected-content-types';

const allowedTypes: ExpectedContentTypes[] = [
  'section',
  'paragraph',
  'link',
  'text',
  'image',
];

export function filterContentTypes(
  contents: MarkdownType<MarkdownContentType>[],
  onTypeFiltered: (type: MarkdownContentType) => void = () => {
    /* noop */
  },
): MarkdownType<ExpectedContentTypes>[] {
  return contents.filter((c) => {
    const allowed = allowedTypes.includes(c.type as ExpectedContentTypes);
    if (!allowed) {
      onTypeFiltered(c.type);
    }

    return allowed;
  }) as MarkdownType<ExpectedContentTypes>[];
}
