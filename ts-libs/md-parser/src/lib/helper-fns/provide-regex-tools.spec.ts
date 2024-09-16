import { RegexContentType, provideRegexTools } from './provide-regex-tools';

import { MatchedContent } from '../_models';

interface Expectation<T extends RegexContentType> {
  shouldMatch: string[];
  shouldNotMatch: string[];
  expectedMatchFromFirstMatch: MatchedContent<T>;
}

describe('provideRegexTools', () => {
  const testCases: Array<[RegexContentType, Expectation<RegexContentType>]> = [
    [
      'code',
      {
        shouldMatch: ['`code` line `other`', '`code`'],
        shouldNotMatch: ['random string', 'no ` close'],
        expectedMatchFromFirstMatch: {
          matched: '`code`',
          content: { type: 'code', element: 'code' },
        },
      },
    ],
    [
      'image',
      {
        shouldMatch: [
          '[![alt-value](/src-value?placement=end) link text](/href)',
          '![alt](/src)',
        ],
        shouldNotMatch: ['[link](/href)', 'random string'],
        expectedMatchFromFirstMatch: {
          matched: '![alt-value](/src-value?placement=end)',
          content: {
            type: 'image',
            alt: 'alt-value',
            src: '/src-value',
            placement: 'end',
          },
        },
      },
    ],
    [
      'link',
      {
        shouldMatch: ['[content](/href)'],
        shouldNotMatch: ['random string'],
        expectedMatchFromFirstMatch: {
          matched: '[content](/href)',
          content: { type: 'link', content: 'content', href: '/href' },
        },
      },
    ],
    [
      'text',
      {
        shouldMatch: ['random string', 'other random'],
        shouldNotMatch: [],
        expectedMatchFromFirstMatch: {
          matched: 'random string',
          content: { type: 'text', content: 'random string' },
        },
      },
    ],
    [
      'list',
      {
        shouldMatch: ['  - list item', '- list item'],
        shouldNotMatch: ['-no space', 'random string'],
        expectedMatchFromFirstMatch: {
          matched: '  - list item',
          content: {
            type: 'list',
            indent: 2,
            rawValue: 'list item',
            items: [],
          },
        },
      },
    ],
    [
      'commented',
      {
        shouldMatch: ['<!-- something -->'],
        shouldNotMatch: ['regular line'],
        expectedMatchFromFirstMatch: {
          matched: '<!-- something -->',
          content: {
            type: 'commented',
            lines: ['something'],
          },
        },
      },
    ],
  ];

  describe.each(testCases)(
    "('%s')",
    (type, { shouldMatch, shouldNotMatch, expectedMatchFromFirstMatch }) => {
      let tools: ReturnType<typeof provideRegexTools>;

      beforeEach(() => {
        tools = provideRegexTools(type);
      });

      describe('regex', () => {
        for (const shouldMatchValue of shouldMatch) {
          it(`should match "${shouldMatchValue}"`, () => {
            expect(shouldMatchValue.match(tools.regex)).toBeTruthy();
          });
        }

        for (const shouldNotMatchValue of shouldNotMatch) {
          it(`should not match "${shouldNotMatchValue}"`, () => {
            expect(shouldNotMatchValue.match(tools.regex)).toBeNull();
          });
        }
      });

      describe('contentFn', () => {
        it(`should return expected for "${shouldMatch[0]}"`, () => {
          const match = shouldMatch[0].match(tools.regex);
          if (!match) {
            throw new Error(`Failed to match`);
          }

          expect(tools.contentFn(match)).toEqual(expectedMatchFromFirstMatch);
        });
      });
    },
  );
});
