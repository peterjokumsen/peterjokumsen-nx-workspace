import { ReadResult } from '../_models';
import { readLine } from './read-line';

/**
 * Reads a paragraph from the provided lines. Will read until an empty line is found.
 * @param lines - The lines to read.
 * @param start - The line index to start reading.
 * @returns The read paragraph and the last line index read.
 */
export function readParagraph(
  lines: string[],
  start: number,
): ReadResult<'paragraph'> {
  const linesToRead = [lines[start]];

  let lineIndex = start + 1;
  for (; lineIndex < lines.length; lineIndex++) {
    if (!lines[lineIndex]) break;
    linesToRead.push(lines[lineIndex]);
  }

  return {
    result: {
      type: 'paragraph',
      content: linesToRead.reduce((acc: ReturnType<typeof readLine>, line) => {
        const readLineResult = readLine(line);
        return acc.concat(readLineResult);
      }, []),
    },
    lastLineIndex: lineIndex - 1,
  };
}
