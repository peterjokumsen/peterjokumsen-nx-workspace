import { MarkdownContentType } from './markdown-content-type';
import { ParagraphContentType } from './paragraph-content-type';
import { SectionContentType } from './section-content-type';

export interface HasMarkdownContentType {
  type: MarkdownContentType | string;
}

export interface MarkdownCode extends HasMarkdownContentType {
  type: 'code';
  element: string;
}

export interface MarkdownCodeBlock extends HasMarkdownContentType {
  type: 'code-block';
  language?: unknown; // TODO: Add language type(s)
  lines: string[];
}

export interface MarkdownListElement extends HasMarkdownContentType {
  type: 'list' | 'ordered-list';
  indent: number;
  rawValue?: string;
  items: MarkdownType<SectionContentType>[];
}

export interface MarkdownList extends MarkdownListElement {
  type: 'list';
}

export interface MarkdownOrderedList extends MarkdownListElement {
  type: 'ordered-list';
}

export interface MarkdownParagraph extends HasMarkdownContentType {
  type: 'paragraph';
  content: string | MarkdownType<ParagraphContentType>[];
}

export interface MarkdownQuote extends HasMarkdownContentType {
  type: 'quote';
  content: string | MarkdownType<SectionContentType>[];
}

export interface MarkdownHorizontalRule extends HasMarkdownContentType {
  type: 'horizontal-rule';
}

export interface MarkdownText extends HasMarkdownContentType {
  type: 'text';
  format?: 'bold' | 'italic' | 'bold-italic' | 'strike-through' | 'line-break';
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
  contents: MarkdownType<SectionContentType>[];
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

export type MarkdownType<T extends MarkdownContentType> = Extract<
  MarkdownContent,
  { type: T }
>;
