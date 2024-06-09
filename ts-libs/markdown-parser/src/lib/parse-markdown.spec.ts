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
    let sections: MarkdownSection[];

    beforeEach(() => {
      const markdown = fs.readFileSync(
        path.join(__dirname, `./test-mds/${fileName}`),
        'utf-8',
      );
      sections = parseMarkdown(markdown);
    });

    const multiple = expectation.expectedTitles.length > 1;
    it(`should have title${multiple ? 's' : ''} of ${multiple ? JSON.stringify(expectation.expectedTitles) : `"${expectation.expectedTitles[0]}"`}`, () => {
      expect(sections.map((s) => s.title)).toEqual(expectation.expectedTitles);
    });

    it('should have expected content', () => {
      expect(sections.map((s) => s.content)).toEqual(
        expectation.expectedContents,
      );
    });
  }

  describe(`when reading basic.md`, () => {
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
  });

  describe(`when reading no-title.md`, () => {
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
  });

  describe(`when reading multiple-sections.md`, () => {
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

  describe(`when reading image-and-link.md`, () => {
    testMarkdownFile('image-and-link.md', {
      expectedTitles: ['Test link and image'],
      expectedContents: [
        [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                content: 'This is a ',
              },
              {
                type: 'link',
                content: [{ type: 'text', content: 'link' }],
                href: '/link',
              },
              {
                type: 'text',
                content: ' and this is an ',
              },
              {
                type: 'image',
                alt: 'image',
                src: '/image',
              },
              {
                type: 'text',
                content: '.',
              },
            ],
          },
        ],
      ],
    });
  });

  describe(`when reading link-only.md`, () => {
    testMarkdownFile('link-only.md', {
      expectedTitles: ['Line with only link'],
      expectedContents: [
        [
          {
            type: 'paragraph',
            content: [
              {
                type: 'link',
                content: [{ type: 'text', content: 'link' }],
                href: '/link',
              },
            ],
          },
        ],
      ],
    });
  });

  describe(`when reading image-only.md`, () => {
    testMarkdownFile('image-only.md', {
      expectedTitles: ['Line with only image'],
      expectedContents: [
        [
          {
            type: 'paragraph',
            content: [
              {
                type: 'image',
                alt: 'image',
                src: '/image',
              },
            ],
          },
        ],
      ],
    });
  });

  describe(`when reading link-with-image.md`, () => {
    testMarkdownFile('link-with-image.md', {
      expectedTitles: ['Image as link content'],
      expectedContents: [
        [
          {
            type: 'paragraph',
            content: [
              {
                type: 'link',
                content: [
                  {
                    type: 'image',
                    alt: 'image',
                    src: '/image',
                  },
                ],
                href: '/link',
              },
            ],
          },
        ],
      ],
    });
  });
});
