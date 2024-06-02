import * as fs from 'node:fs';
import * as path from 'node:path';

import { MarkdownContent, MarkdownSection } from './models';

import { parseMarkdown } from './';

describe('parseMarkdown', () => {
  describe('when the markdown is empty', () => {
    it('should return an empty section', () => {
      const result = parseMarkdown('');
      expect(result).toEqual([
        {
          type: 'section',
          title: '',
          content: [],
        },
      ]);
    });
  });

  describe('when the markdown has carriage returns', () => {
    it('should strip "\r" character and return expected', () => {
      const result = parseMarkdown('# A Title\r\n\r\nSome Content');
      expect(result.length).toEqual(1);
      const section = result[0];
      expect(section).toEqual({
        type: 'section',
        title: 'A Title',
        content: [
          {
            type: 'paragraph',
            content: 'Some Content',
          },
        ],
      });
    });
  });

  interface MarkdownSectionExpectation {
    expectedTitles: string[];
    expectedContents: MarkdownContent[][];
  }

  function testMarkdownFile(
    fileName: string,
    expectation: MarkdownSectionExpectation,
  ) {
    describe(`when reading ${fileName}`, () => {
      let sections: MarkdownSection[];

      beforeEach(() => {
        const markdown = fs.readFileSync(
          path.join(__dirname, `./test-mds/${fileName}`),
          'utf-8',
        );
        sections = parseMarkdown(markdown);
      });

      const multiple = expectation.expectedTitles.length > 1;
      it(`should have section${multiple ? 's' : ''} with title of ${multiple ? JSON.stringify(expectation.expectedTitles) : `"${expectation.expectedTitles[0]}"`}`, () => {
        expect(sections.map((s) => s.title)).toEqual(
          expectation.expectedTitles,
        );
      });

      it('should have expected content', () => {
        expect(sections.map((s) => s.content)).toEqual(
          expectation.expectedContents,
        );
      });
    });
  }

  testMarkdownFile('basic.md', {
    expectedTitles: ['Section title'],
    expectedContents: [
      [
        {
          type: 'paragraph',
          content: 'Section text.',
        },
      ],
    ],
  });

  testMarkdownFile('no-title.md', {
    expectedTitles: [''],
    expectedContents: [
      [
        {
          type: 'paragraph',
          content: 'No title here.',
        },
      ],
    ],
  });

  testMarkdownFile('multiple-sections.md', {
    expectedTitles: ['Section 1', 'Section 2'],
    expectedContents: [
      [
        {
          type: 'paragraph',
          content: 'This is the first section.',
        },
      ],
      [
        {
          type: 'paragraph',
          content: 'This is the second section.',
        },
      ],
    ],
  });
});
