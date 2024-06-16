import { MarkdownContent } from '@peterjokumsen/ts-md-models';
import { RichContentMap } from '../_models';

export function splitRichContent(
  rawContent: string,
  richContentMap: RichContentMap,
): MarkdownContent[] {
  const result: MarkdownContent[] = [];
  const contentKeys = Object.keys(richContentMap).join('|');
  for (const split of rawContent.split(new RegExp(`(${contentKeys})`))) {
    if (!split) continue;
    if (split in richContentMap) {
      result.push(richContentMap[split].content);
    } else {
      result.push({ type: 'text', content: split });
    }
  }

  return result;
}
