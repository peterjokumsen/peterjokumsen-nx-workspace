import { MarkdownContentType } from '../models';
import { getContentType } from './';

interface TestCase {
  line: string;
  expectedType: MarkdownContentType;
}

describe('getContentType', () => {
  describe.each<[string, TestCase]>([
    [
      'line starts with #',
      {
        line: '# Section 1',
        expectedType: 'section',
      },
    ],
    [
      'line starts without known markdown syntax',
      {
        line: 'This is a paragraph',
        expectedType: 'paragraph',
      },
    ],
  ])('when %s', (_, { line, expectedType }) => {
    it(`should return "${expectedType}"`, () => {
      expect(getContentType(line)).toBe(expectedType);
    });
  });
});
