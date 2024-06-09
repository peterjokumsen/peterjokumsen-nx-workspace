import { MarkdownContentType } from './markdown-content-type';

export type RichContentType = Extract<MarkdownContentType, 'image' | 'link'>;
