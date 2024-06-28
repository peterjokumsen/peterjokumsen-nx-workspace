import { MarkdownContentType, MarkdownType } from '@peterjokumsen/ts-md-models';

export type ExpectedContentTypes = Extract<
  MarkdownContentType,
  'section' | 'paragraph' | 'link' | 'text' | 'image' | 'list'
>;

const allowed: Required<Record<ExpectedContentTypes, object>> = {
  section: {},
  paragraph: {},
  link: {},
  text: {},
  image: {},
  list: {},
};

const allowedTypes = Object.keys(allowed) as ExpectedContentTypes[];

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
