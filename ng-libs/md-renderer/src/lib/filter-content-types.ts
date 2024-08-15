import { MarkdownContentType, MarkdownType } from '@peterjokumsen/ts-md-models';

export type ExpectedContentTypes = Extract<
  MarkdownContentType,
  | 'code'
  | 'code-block'
  | 'commented'
  | 'horizontal-rule'
  | 'image'
  | 'link'
  | 'list'
  | 'paragraph'
  | 'quote'
  | 'section'
  | 'text'
>;

const allowed: Required<Record<ExpectedContentTypes, object>> = {
  'code-block': {},
  'horizontal-rule': {},
  code: {},
  commented: {},
  image: {},
  link: {},
  list: {},
  paragraph: {},
  quote: {},
  section: {},
  text: {},
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
