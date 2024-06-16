import { MarkdownContent } from './markdown-content';
import { MarkdownContentType } from './markdown-content-type';

export function mdModelCheck<T extends MarkdownContentType>(
  type: T,
  value: MarkdownContent,
): value is Extract<MarkdownContent, { type: T }> {
  return value.type === type;
}
