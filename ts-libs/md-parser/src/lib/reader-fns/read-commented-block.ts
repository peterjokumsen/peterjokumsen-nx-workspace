import { MarkdownCommentBlock } from '@peterjokumsen/ts-md-models';
import { ReadResult } from '../_models';

export function readCommentedBlock(
  inputLines: string[],
  i: number,
): ReadResult<'commented'> {
  const lines = [];
  for (; i < inputLines.length; i++) {
    const currentLine = inputLines[i];
    if (currentLine.includes('<!--')) {
      const split = currentLine.split('<!--');
      if (split[1]?.trim()) {
        lines.push(split[1].trim());
      }

      continue;
    }
    if (currentLine.includes('-->')) {
      const split = currentLine.split('-->');
      if (split[0]?.trim()) {
        lines.push(split[0].trim());
      }
      inputLines[i] = split[1]?.trim() ?? '';
      break;
    }

    lines.push(currentLine);
  }

  const result: MarkdownCommentBlock = {
    type: 'commented',
    lines,
  };
  return {
    result,
    lastLineIndex: i,
  };
}
