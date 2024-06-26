import { RegexContentType, provideRegexTools } from './provide-regex-tools';

export function lineHasContentType(
  contentType: RegexContentType,
  line: string,
): boolean {
  const pattern = provideRegexTools(contentType).regex;
  if (!pattern) {
    throw new Error(
      `No search pattern for '${contentType}'. Unable to find '${contentType}' content in line '${line}'`,
    );
  }

  return pattern.test(line);
}
