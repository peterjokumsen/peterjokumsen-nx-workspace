import { MarkdownContentType } from './markdown-content-type';

export type SectionContentType = Extract<
  MarkdownContentType,
  | 'code-block'
  | 'horizontal-rule'
  | 'list'
  | 'ordered-list'
  | 'paragraph'
  | 'quote'
  | 'section'
>;
