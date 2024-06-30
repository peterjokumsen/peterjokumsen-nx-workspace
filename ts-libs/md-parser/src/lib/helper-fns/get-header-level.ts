/**
 * Returns the level of the header in the line.
 * @param line - The line to check, expected to have a header. e.g. `# Header`
 * @returns number - The level of the header.
 */
export function getHeaderLevel(line: string): number {
  const trimmedLine = line.trimStart();
  const headerCount = trimmedLine.match(/^#+/);
  return headerCount ? headerCount[0].length : 0;
}
