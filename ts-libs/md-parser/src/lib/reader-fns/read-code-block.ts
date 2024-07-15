import { ReadResult } from '../_models';

export function readCodeBlock(
  lines: string[],
  start: number,
): ReadResult<'code-block'> {
  const line = lines[start];
  if (!line.trimStart().startsWith('```')) {
    throw new Error(
      `Invalid code block start. "${line}" does not start with "\`\`\`".`,
    );
  }

  const language = line.trimStart().slice(3).trim();
  const indent = line.indexOf('```');
  const codeBlockLines: string[] = [];
  let lineIndex = start + 1;
  for (; lineIndex < lines.length; lineIndex++) {
    const codeLine = lines[lineIndex];
    if (codeLine.trimStart().startsWith('```')) break;
    codeBlockLines.push(codeLine.slice(indent));
  }

  return {
    result: {
      type: 'code-block',
      indent,
      language,
      lines: codeBlockLines,
    },
    lastLineIndex: lineIndex,
  };
}
