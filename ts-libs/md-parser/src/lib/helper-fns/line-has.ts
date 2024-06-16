import { RichContentType } from '@peterjokumsen/ts-md-models';
import { regexPatterns } from './regex-patterns';

export function lineHas(tag: RichContentType, line: string): boolean {
  const pattern = regexPatterns[tag];
  if (!pattern) {
    throw new Error(
      `No search pattern for '${tag}'. Unable to find '${tag}' content in line '${line}'`,
    );
  }

  return pattern.test(line);
}
