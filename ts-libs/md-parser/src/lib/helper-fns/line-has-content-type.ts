import { RegexContentType, provideRegexTools } from './provide-regex-tools';

/**
 * Check if a line has a specific content type.
 * @param contentType The content type to check.
 * @param line The line to check.
 * @returns {boolean} True if the line has the content type.
 */
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
