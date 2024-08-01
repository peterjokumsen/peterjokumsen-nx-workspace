import { MarkdownContentType } from './markdown-content-type';

export type SectionContentType = Extract<
  MarkdownContentType,
  | 'code-block'
  | 'commented'
  | 'horizontal-rule'
  | 'list'
  | 'ordered-list'
  | 'paragraph'
  | 'quote'
  | 'section'
>;
