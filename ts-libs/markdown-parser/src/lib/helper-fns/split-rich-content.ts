import { MarkdownContent } from '../models';
import { MatchedContent } from '../_models';

export function splitRichContent(
  content: string,
  richContentMap: { [key: string]: MatchedContent },
): MarkdownContent[] {
  const result: MarkdownContent[] = [];
  for (const split of content.split(
    new RegExp(`(${Object.keys(richContentMap).join('|')})`),
  )) {
    if (!split) continue;
    if (split in richContentMap) {
      result.push(richContentMap[split].content);
    } else {
      result.push({ type: 'text', content: split });
    }
  }

  return result;
}
