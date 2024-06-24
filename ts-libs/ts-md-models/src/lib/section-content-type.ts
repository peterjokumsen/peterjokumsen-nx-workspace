import { MarkdownContentType } from './markdown-content-type';

export type SectionContentType = Extract<
  MarkdownContentType,
  | 'paragraph'
  | 'list'
  | 'ordered-list'
  | 'quote'
  | 'code-block'
  | 'horizontal-rule'
>;
