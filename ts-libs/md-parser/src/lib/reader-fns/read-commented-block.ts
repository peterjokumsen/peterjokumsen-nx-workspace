import { MarkdownCommentBlock } from '@peterjokumsen/ts-md-models';
import { ReadResult } from '../_models';
import { provideRegexTools } from '../helper-fns';

export function readCommentedBlock(
  inputLines: string[],
  startingIndex: number,
): ReadResult<'commented'> {
  const regexTool = provideRegexTools('commented');
  const match = inputLines[startingIndex].match(regexTool.regex);
  if (match) {
    const matched = regexTool.contentFn(match);
    inputLines[startingIndex] = inputLines[startingIndex]
      .split(matched.matched)
      .join('');
    return {
      lastLineIndex: startingIndex - 1,
      result: matched.content,
    };
  }

  const lines = [];
  let initialHasContent = false;
  let i = startingIndex;
  for (; i < inputLines.length; i++) {
    const currentLine = inputLines[i];
    if (currentLine.includes('<!--')) {
      const split = currentLine.split('<!--');
      if (split[1]?.trim()) {
        lines.push(split[1].trim());
      }

      inputLines[i] = split[0];
      initialHasContent = !!split[0];

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
    inputLines[i] = '';
  }

  const result: MarkdownCommentBlock = {
    type: 'commented',
    lines,
  };
  return {
    result,
    lastLineIndex: initialHasContent ? startingIndex - 1 : i,
  };
}
