import { MarkdownContent, MarkdownType } from './markdown-content';

import { MarkdownContentType } from './markdown-content-type';

export function mdModelCheck<T extends MarkdownContentType>(
  type: T,
  value: MarkdownContent,
): value is MarkdownType<T> {
  return value.type === type;
}
