import { ReadResult } from '../_models';

export function readParagraph(lines: string[], start: number): ReadResult {
  return {
    content: {
      type: 'paragraph',
      content: lines[start],
    },
    nextStart: start,
  };
}
