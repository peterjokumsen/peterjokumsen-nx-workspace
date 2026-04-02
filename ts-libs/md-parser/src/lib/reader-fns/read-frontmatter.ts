import { MarkdownMetaData } from '@peterjokumsen/ts-md-models';

/**
 * Reads a frontmatter block from the provided lines starting from the current index.
 * @param lines
 * @param currentIndex
 * @returns The frontmatter markdown type and the index of the last line read.
 */
export function readMetadata(
  lines: string[],
  currentIndex: number,
): { result: MarkdownMetaData; lastLineIndex: number } {
  const frontmatter: MarkdownMetaData = { type: 'frontmatter' };
  let lastLineIndex = currentIndex;

  // Skip the first '---'
  for (let idx = currentIndex + 1; idx < lines.length; idx++) {
    const line = lines[idx];
    const colonIndex = line.indexOf(':');
    lastLineIndex = idx;

    if (line === '') continue;
    if (line === '---' || colonIndex === -1) {
      if (line !== '---') lastLineIndex--;
      break;
    }

    const key = line.substring(0, colonIndex).trim();
    const rawValue = line.substring(colonIndex + 1).trim();

    // Remove quotes if present
    const value = rawValue.replace(/^["'](.*)["']$/, '$1');

    switch (key) {
      case 'tags': {
        if (value.startsWith('[') && value.endsWith(']')) {
          frontmatter[key] = value
            .substring(1, value.length - 1)
            .split(',')
            .map((s) => s.trim().replace(/^["'](.*)["']$/, '$1'));
        } else if (value.includes(',')) {
          frontmatter[key] = value.split(',').map((s) => s.trim());
        } else {
          frontmatter[key] = [value];
        }
        break;
      }

      case 'title':
      case 'date':
      case 'description':
      case 'image':
      case 'imageAlt': {
        frontmatter[key] = value;
        break;
      }

      default: {
        console.warn(`Unknown frontmatter key: ${key}`);
        break;
      }
    }
  }

  return {
    result: frontmatter,
    lastLineIndex,
  };
}
