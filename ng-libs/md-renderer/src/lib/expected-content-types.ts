import { MarkdownContentType } from '@peterjokumsen/ts-md-models';

export type ExpectedContentTypes = Extract<
  MarkdownContentType,
  'section' | 'paragraph' | 'link' | 'text' | 'image'
>;
