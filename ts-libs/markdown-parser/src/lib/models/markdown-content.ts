import { MarkdownContentType } from './markdown-content-type';

interface HasMarkdownContentType {
  type: MarkdownContentType;
}

export interface MarkdownCode extends HasMarkdownContentType {
  type: 'code';
  content: string;
}

export interface MarkdownCodeBlock extends HasMarkdownContentType {
  type: 'code-block';
  content: string[];
}

export interface MarkdownList extends HasMarkdownContentType {
  type: 'list';
  content: Array<string | MarkdownContent>;
}

export interface MarkdownOrderedList extends HasMarkdownContentType {
  type: 'ordered-list';
  content: Array<string | MarkdownContent>;
}

export interface MarkdownParagraph extends HasMarkdownContentType {
  type: 'paragraph';
  content: string | MarkdownContent[];
}

export interface MarkdownQuote extends HasMarkdownContentType {
  type: 'quote';
  content: string | MarkdownContent[];
}

export interface MarkdownHorizontalRule extends HasMarkdownContentType {
  type: 'horizontal-rule';
}

export interface MarkdownText extends HasMarkdownContentType {
  type: 'text';
  content: string;
}

export interface MarkdownImage extends HasMarkdownContentType {
  type: 'image';
  src: string;
  alt: string;
}

export interface MarkdownLink extends HasMarkdownContentType {
  type: 'link';
  href: string;
  content: string | MarkdownContent[];
}

export interface MarkdownSection extends HasMarkdownContentType {
  type: 'section';
  title: string;
  content: MarkdownContent[];
}

export type MarkdownContent =
  | MarkdownCode
  | MarkdownCodeBlock
  | MarkdownList
  | MarkdownOrderedList
  | MarkdownQuote
  | MarkdownHorizontalRule
  | MarkdownImage
  | MarkdownLink
  | MarkdownSection
  | MarkdownText
  | MarkdownParagraph;
