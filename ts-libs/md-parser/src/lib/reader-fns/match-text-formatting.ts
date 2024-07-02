import { MarkdownFormatType, MarkdownType } from '@peterjokumsen/ts-md-models';

import { MatchedContent } from '../_models';

/**
 * Regular expression to match text formatting in a line of markdown.
 * Will check for italic, bold, bold-italic, and strike-through. @see matchTextFormatting
 *
 * One drawback for this, is that the formatting will depend on the first matched operators,
 * so if the line contains `--content---`, it will be matched as bold including the trailing `---`.
 * This is currently an acceptable limitation.
 */
const formatRegex = new RegExp(/([_*]{1,3}|~~)(.+?)([_*]{1,3}|~~)/, 'g');

/**
 * Match text formatting in a line of markdown.
 * Will check for:
 * - italic `_value_` or `*value*`
 * - bold `__content__` or `**content**`
 * - bold-italic `___content___` or `***content***`
 * - strike-through `~~content~~`
 * - line-break (if line ends with 2 spaces)
 * @param line
 * @returns Array of matches found with the parsed content.
 */
export function matchTextFormatting(line: string): MatchedContent<'text'>[] {
  const resultByMatched: { [matched: string]: MarkdownType<'text'> } = {};
  const formattingMatches = line.matchAll(formatRegex);
  for (const match of formattingMatches) {
    const [matched, format, content] = match;
    if (matched in resultByMatched) continue;
    let formatType: MarkdownFormatType = 'italic';
    if (format.includes('~')) {
      formatType = 'strike-through';
    } else if (format.length > 1) {
      formatType = format.length === 2 ? 'bold' : 'bold-italic';
    }

    resultByMatched[matched] = {
      type: 'text',
      format: formatType,
      content,
    };
  }

  const result: MatchedContent<'text'>[] = Object.entries(resultByMatched).map(
    ([matched, content]) => ({ matched, content }),
  );
  if (line.endsWith('  ')) {
    result.push({
      matched: '__line-break__',
      content: {
        type: 'text',
        format: 'line-break',
        content: '',
      },
    });
  }

  return result;
}
