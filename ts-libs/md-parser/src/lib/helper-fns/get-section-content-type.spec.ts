import { MarkdownContentType } from '@peterjokumsen/ts-md-models';
import { getSectionContentType } from './';

interface TestCase {
  line: string;
  expectedType: MarkdownContentType;
}

describe('getSectionContentType', () => {
  describe.each<[string, TestCase]>([
    [
      'line starts with #',
      {
        line: '# Section 1',
        expectedType: 'section',
      },
    ],
    [
      'line has "- "',
      {
        line: '  - List item',
        expectedType: 'list',
      },
    ],
    [
      'line has "  ```"',
      {
        line: '  ```',
        expectedType: 'code-block',
      },
    ],
    [
      'line has "---"',
      {
        line: '---',
        expectedType: 'paragraph',
      },
    ],
    [
      'line starts without known markdown syntax',
      {
        line: 'This is a paragraph',
        expectedType: 'paragraph',
      },
    ],
    [
      'line starts with >',
      {
        line: '  > Hello world',
        expectedType: 'quote',
      },
    ],
  ])('when %s', (_, { line, expectedType }) => {
    it(`should return "${expectedType}"`, () => {
      expect(getSectionContentType(line)).toBe(expectedType);
    });
  });
});
