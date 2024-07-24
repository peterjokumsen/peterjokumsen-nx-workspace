import * as fs from 'node:fs';
import * as path from 'node:path';

import { MarkdownContent, MarkdownSection } from '@peterjokumsen/ts-md-models';

import { parseMarkdown } from './';

describe('parseMarkdown', () => {
  describe('when the markdown is empty', () => {
    it('should return an empty section', () => {
      const result = parseMarkdown('');
      expect(result).toEqual({
        sections: [
          {
            type: 'section',
            title: '',
            contents: [],
          },
        ],
      });
    });
  });

  describe('when the markdown has carriage returns', () => {
    it('should strip "\r" character and return expected', () => {
      const { sections: result } = parseMarkdown(
        '# A Title\r\n\r\nSome Content',
      );
      expect(result.length).toEqual(1);
      const section = result[0];
      expect(section).toEqual({
        type: 'section',
        title: 'A Title',
        contents: [
          {
            type: 'paragraph',
            content: [{ type: 'text', content: 'Some Content' }],
          },
        ],
      });
    });
  });

  function itShouldBeParsed(
    fileName: string,
    ...expectations: Array<[string, MarkdownContent[]]>
  ) {
    let sections: MarkdownSection[];

    beforeEach(() => {
      const markdown = fs.readFileSync(
        path.join(__dirname, `../../test-mds/${fileName}`),
        'utf-8',
      );

      if (!markdown) {
        throw new Error(`Could not read file '${fileName}' for test`);
      }

      const result = parseMarkdown(markdown);
      sections = result.sections;
      if (sections.length !== expectations.length) {
        throw new Error(
          `Expected ${expectations.length} sections, but got ${sections.length}`,
        );
      }
    });

    it.each(expectations.map((v, i) => [...v, i]))(
      'should have section "%s" with expected content',
      (title, contents, index) => {
        const actualSection = sections[index];
        expect(actualSection.title).toEqual(title);
        expect(actualSection.contents).toEqual(contents);
      },
    );
  }

  describe(`when reading basic.md`, () => {
    itShouldBeParsed('basic.md', [
      'Section title',
      [
        {
          type: 'paragraph',
          content: [{ type: 'text', content: 'Section text.' }],
        },
      ],
    ]);
  });

  describe(`when reading no-title.md`, () => {
    itShouldBeParsed('no-title.md', [
      '',
      [
        {
          type: 'paragraph',
          content: [{ type: 'text', content: 'No title here.' }],
        },
      ],
    ]);
  });

  describe(`when reading multiple-sections.md`, () => {
    itShouldBeParsed(
      'multiple-sections.md',
      [
        'Section 1',
        [
          {
            type: 'paragraph',
            content: [{ type: 'text', content: 'This is the first section.' }],
          },
        ],
      ],
      [
        'Section 2',
        [
          {
            type: 'paragraph',
            content: [{ type: 'text', content: 'This is the second section.' }],
          },
        ],
      ],
    );
  });

  describe(`when reading image-and-link.md`, () => {
    itShouldBeParsed('image-and-link.md', [
      'Test link and image',
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
              content: 'link',
              href: 'https://example.net',
            },
            {
              type: 'text',
              content: ' and this is an ',
            },
            {
              type: 'image',
              alt: 'image',
              src: 'https://example.net',
            },
            {
              type: 'text',
              content: '.',
            },
          ],
        },
      ],
    ]);
  });

  describe(`when reading link-only.md`, () => {
    itShouldBeParsed('link-only.md', [
      'Line with only link',
      [
        {
          type: 'paragraph',
          content: [
            {
              type: 'link',
              content: 'link',
              href: 'https://example.net',
            },
          ],
        },
      ],
    ]);
  });

  describe(`when reading image-only.md`, () => {
    itShouldBeParsed('image-only.md', [
      'Line with only image',
      [
        {
          type: 'paragraph',
          content: [
            {
              type: 'image',
              alt: 'image',
              src: 'https://example.net',
            },
          ],
        },
      ],
    ]);
  });

  describe(`when reading link-with-image.md`, () => {
    itShouldBeParsed('link-with-image.md', [
      'Image as link content',
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
                  src: 'https://example.net',
                },
              ],
              href: 'https://example.net',
            },
          ],
        },
      ],
    ]);
  });

  describe('when reading list.md', () => {
    itShouldBeParsed(
      'list.md',
      [
        'Basic list',
        [
          {
            type: 'list',
            indent: 0,
            items: [
              {
                type: 'paragraph',
                content: [{ type: 'text', content: 'Item 1' }],
              },
              {
                type: 'paragraph',
                content: [{ type: 'text', content: 'Item 2' }],
              },
            ],
          },
        ],
      ],
      [
        'Custom list',
        [
          {
            type: 'list',
            indent: 0,
            items: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'image',
                    alt: 'Image 1',
                    src: 'https://example.net',
                  },
                ],
              },
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    content: 'Test ',
                  },
                  {
                    type: 'link',
                    content: 'link',
                    href: 'https://example.net',
                  },
                ],
              },
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'link',
                    href: 'https://example.net',
                    content: [
                      { type: 'text', content: 'link ' },
                      {
                        type: 'image',
                        alt: 'Image 2',
                        src: 'https://example.net',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      ],
    );
  });

  describe(`when reading inline-code.md`, () => {
    itShouldBeParsed(
      'inline-code.md',
      [
        'Inline code',
        [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                content: 'This is a paragraph with some ',
              },
              {
                type: 'code',
                element: 'inline code',
              },
              {
                type: 'text',
                content: ' in it.',
              },
            ],
          },
        ],
      ],
      [
        'Inline code in link',
        [
          {
            type: 'paragraph',
            content: [
              {
                type: 'link',
                content: [
                  {
                    type: 'text',
                    content: 'This is a link with ',
                  },
                  {
                    type: 'code',
                    element: 'inline code',
                  },
                  {
                    type: 'text',
                    content: ' in it',
                  },
                ],
                href: 'https://example.com',
              },
              { type: 'text', content: '.' },
            ],
          },
        ],
      ],
    );
  });

  describe('when reading formatted-text.md', () => {
    itShouldBeParsed(
      'formatted-text.md',
      [
        'Formatted text (asterisk)',
        [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                content: 'Using ',
              },
              { type: 'code', element: '*' },
              {
                type: 'text',
                content: ' for ',
              },
              {
                type: 'text',
                format: 'bold-italic',
                content: 'super text',
              },
              {
                type: 'text',
                content: ', ',
              },
              {
                type: 'text',
                format: 'bold',
                content: 'bold text',
              },
              {
                type: 'text',
                content: ', and ',
              },
              {
                type: 'text',
                format: 'italic',
                content: 'italic text',
              },
              {
                type: 'text',
                content: '.',
              },
            ],
          },
        ],
      ],
      [
        'Formatted text (underscore)',
        [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                content: 'Using ',
              },
              { type: 'code', element: '_' },
              {
                type: 'text',
                content: ' for ',
              },
              {
                type: 'text',
                format: 'bold-italic',
                content: 'super text',
              },
              {
                type: 'text',
                content: ', ',
              },
              {
                type: 'text',
                format: 'bold',
                content: 'bold text',
              },
              {
                type: 'text',
                content: ', and ',
              },
              {
                type: 'text',
                format: 'italic',
                content: 'italic text',
              },
              {
                type: 'text',
                content: '.',
              },
            ],
          },
        ],
      ],
      [
        'Formatted text (tilde)',
        [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                content: 'Using ',
              },
              { type: 'code', element: '~' },
              {
                type: 'text',
                content: ' for ',
              },
              {
                type: 'text',
                format: 'strike-through',
                content: 'strikethrough text',
              },
              {
                type: 'text',
                content: '.',
              },
            ],
          },
        ],
      ],
      [
        'Formatted text (line break)',
        [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                content: '2 empty spaces for line break',
              },
              {
                type: 'text',
                format: 'line-break',
                content: '',
              },
              {
                type: 'text',
                content: 'and the paragraph goes on...',
              },
            ],
          },
        ],
      ],
    );
  });

  describe('when reading horizontal-line.md', () => {
    itShouldBeParsed('horizontal-line.md', [
      'Horizontal line',
      [
        {
          type: 'paragraph',
          content: [{ type: 'text', content: 'Paragraph 1' }],
        },
        {
          type: 'horizontal-rule',
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', content: 'Paragraph 2' }],
        },
      ],
    ]);
  });

  describe('when reading code-block.md', () => {
    itShouldBeParsed(
      'code-block.md',
      [
        'CSharp',
        [
          {
            type: 'code-block',
            language: 'csharp',
            indent: 0,
            lines: [
              'public class Program',
              '{',
              '    public static void Main()',
              '    {',
              '        Console.WriteLine("Hello, World!");',
              '    }',
              '}',
            ],
          },
        ],
      ],
      [
        'TypeScript',
        [
          {
            type: 'code-block',
            language: 'typescript',
            indent: 0,
            lines: [
              'class Program {',
              '  static Main() {',
              "    console.log('Hello, World!');",
              '  }',
              '}',
            ],
          },
        ],
      ],
      [
        'Shell',
        [
          {
            type: 'code-block',
            language: 'shell',
            indent: 0,
            lines: ['git log --oneline --first-parent'],
          },
        ],
      ],
      [
        'No lang',
        [
          {
            type: 'code-block',
            language: '',
            indent: 0,
            lines: ['echo "Hello, World!"'],
          },
        ],
      ],
    );
  });
});
