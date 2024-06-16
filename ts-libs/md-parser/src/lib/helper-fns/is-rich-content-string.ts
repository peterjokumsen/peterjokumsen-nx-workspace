import { MarkdownContent } from '@peterjokumsen/ts-md-models';
import { RichContentMap } from '../_models';

export function isRichContentString(
  content: string | MarkdownContent[],
  richContentMap: RichContentMap,
): content is string {
  if (typeof content !== 'string') return false;
  return Object.keys(richContentMap).some((key) => content.includes(key));
}
