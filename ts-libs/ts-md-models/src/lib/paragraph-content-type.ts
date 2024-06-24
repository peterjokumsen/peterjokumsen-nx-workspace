import { MarkdownContentType } from './markdown-content-type';

export type ParagraphContentType = Extract<
  MarkdownContentType,
  'image' | 'link' | 'code' | 'text' | 'horizontal-rule'
>;
