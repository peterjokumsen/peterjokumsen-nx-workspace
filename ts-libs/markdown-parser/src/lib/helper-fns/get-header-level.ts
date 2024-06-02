export function getHeaderLevel(line: string): number {
  const trimmedLine = line.trimStart();
  const headerCount = trimmedLine.match(/^#+/);
  return headerCount ? headerCount[0].length : 0;
}
