import { MarkdownType } from '@peterjokumsen/ts-md-models';

import { ReadResult } from '../_models';
import { readParagraph } from './read-paragraph';

/**
 * Reads a quote block from the provided markdown lines.
 * @param lines The markdown lines to read.
 * @param start The line index to start reading.
 * @returns The read quote block and the last line index read.
 */
export function readQuote(lines: string[], start: number): ReadResult<'quote'> {
  let currentLineIdx = start;
  const paragraphLines: string[] = [];
  let indent: number | undefined = undefined;
  for (; currentLineIdx < lines.length; currentLineIdx++) {
    const match = lines[currentLineIdx].match(/(\s.)?>(\s?)(.*)/);
    if (!match) {
      if (currentLineIdx === start) {
        throw new Error(`Line [${start}] "${lines[start]}" is not a quote`);
      } else {
        break;
      }
    }

    const [, indentation, , line] = match;
    const currentIndentation = indentation?.length ?? 0;
    if (indent === undefined) {
      indent = currentIndentation;
    } else if (currentIndentation !== indent) {
      break;
    }

    paragraphLines.push(line ?? '');
  }

  const paragraphs: MarkdownType<'paragraph' | 'horizontal-rule'>[] = [];
  for (
    let paragraphIdx = 0;
    paragraphIdx < paragraphLines.length;
    paragraphIdx++
  ) {
    if (!paragraphLines[paragraphIdx]) continue;
    const { lastLineIndex, result } = readParagraph(
      paragraphLines,
      paragraphIdx,
    );

    paragraphIdx = lastLineIndex;
    paragraphs.push(result);
  }

  return {
    result: {
      type: 'quote',
      indent,
      paragraphs,
    },
    lastLineIndex: currentLineIdx,
  };
}
