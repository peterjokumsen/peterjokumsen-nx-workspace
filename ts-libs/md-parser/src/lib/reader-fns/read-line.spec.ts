import {
  lineHasContentType,
  mapHasContent,
  splitRegexContent,
} from '../helper-fns';

import { MarkdownType } from '@peterjokumsen/ts-md-models';
import { matchParagraphContentType } from './match-paragraph-content-type';
import { readLine } from './read-line';

jest.mock('../helper-fns');
jest.mock('./match-paragraph-content-type');

describe('readLine', () => {
  let lineHasContentTypeSpy: jest.MockedFunction<typeof lineHasContentType>;

  beforeEach(() => {
    lineHasContentTypeSpy = jest
      .mocked(lineHasContentType)
      .mockName('lineHasContentType');
  });

  afterEach(() => {
    lineHasContentTypeSpy.mockClear();
  });

  describe('when line has no content type or formatting', () => {
    beforeEach(() => {
      lineHasContentTypeSpy.mockReturnValue(false);
    });

    it('should return line as string', () => {
      const result = readLine('Some content');
      expect(result).toEqual([{ type: 'text', content: 'Some content' }]);
    });
  });

  describe('when line has content type(s)', () => {
    let mapHasContentSpy: jest.MockedFunction<typeof mapHasContent>;
    let splitRegexContentSpy: jest.MockedFunction<typeof splitRegexContent>;
    let matchParagraphContentSpy: jest.MockedFunction<
      typeof matchParagraphContentType
    >;

    beforeEach(() => {
      mapHasContentSpy = jest.mocked(mapHasContent).mockName('mapHasContent');
      splitRegexContentSpy = jest
        .mocked(splitRegexContent)
        .mockName('splitRegexContent');
      matchParagraphContentSpy = jest
        .mocked(matchParagraphContentType)
        .mockName('matchParagraphContentType');
    });

    afterEach(() => {
      splitRegexContentSpy.mockClear();
      matchParagraphContentSpy.mockClear();
    });

    describe('link and image', () => {
      it('should use helpers as expected', () => {
        lineHasContentTypeSpy.mockReturnValue(true);
        mapHasContentSpy.mockReturnValue(true);
        splitRegexContentSpy.mockReturnValue([]);
        matchParagraphContentSpy.mockImplementation((type) => {
          if (type === 'image') {
            return [
              {
                matched: 'c',
                content: {
                  type: 'image',
                  alt: 'alt-text',
                  src: '/image',
                },
              },
            ];
          }

          return [
            {
              matched: 'b__image_0__',
              content: {
                type: 'link',
                content: '__image_0__',
                href: '/link',
              },
            },
          ];
        });

        // Act
        readLine('a bc c d');

        expect(lineHasContentTypeSpy).toHaveBeenCalledWith('image', 'a bc c d');
        expect(matchParagraphContentSpy).toHaveBeenCalledWith(
          'image',
          'a bc c d',
        );
        expect(lineHasContentTypeSpy).toHaveBeenCalledWith(
          'link',
          'a b__image_0__ __image_0__ d',
        );
        expect(matchParagraphContentSpy).toHaveBeenCalledWith(
          'link',
          'a b__image_0__ __image_0__ d',
        );
        expect(splitRegexContentSpy).toHaveBeenCalledWith(
          '__image_0__',
          expect.any(Object),
        );
        expect(splitRegexContentSpy).toHaveBeenCalledWith(
          'a __link_0__ __image_0__ d',
          expect.any(Object),
        );
      });
    });

    describe('link', () => {
      it('should not try to match image', () => {
        lineHasContentTypeSpy.mockImplementation((t) => t === 'link');
        matchParagraphContentSpy.mockReturnValue([
          {
            matched: 'bc',
            content: {
              type: 'link',
              content: 'text',
              href: '/link',
            },
          },
        ]);

        // Act
        readLine('abcd');

        expect(matchParagraphContentSpy).not.toHaveBeenCalledWith(
          'image',
          expect.any(String),
        );
        expect(lineHasContentTypeSpy).toHaveBeenCalledWith('link', 'abcd');
        expect(matchParagraphContentSpy).toHaveBeenCalledWith('link', 'abcd');
        expect(splitRegexContentSpy).toHaveBeenCalledWith(
          'a__link_0__d',
          expect.any(Object),
        );
      });
    });

    describe('image', () => {
      it('should not try to match link', () => {
        lineHasContentTypeSpy.mockImplementation((t) => t === 'image');
        matchParagraphContentSpy.mockReturnValue([
          {
            matched: 'bc',
            content: {
              type: 'image',
              alt: 'text',
              src: '/image',
            },
          },
        ]);

        // Act
        readLine('abcd');

        expect(matchParagraphContentSpy).not.toHaveBeenCalledWith(
          'link',
          expect.any(String),
        );
        expect(matchParagraphContentSpy).toHaveBeenCalledWith('image', 'abcd');
        expect(splitRegexContentSpy).toHaveBeenCalledWith(
          'a__image_0__d',
          expect.any(Object),
        );
      });
    });

    describe('code', () => {
      it('should match content', () => {
        lineHasContentTypeSpy.mockImplementation((t) => t === 'code');
        matchParagraphContentSpy.mockReturnValue([
          {
            matched: 'bc',
            content: {
              type: 'code',
              element: 'a + b = c',
            },
          },
        ]);

        // Act
        readLine('abcd');

        expect(lineHasContentTypeSpy).toHaveBeenCalledWith('code', 'abcd');
        expect(matchParagraphContentSpy).toHaveBeenCalledWith('code', 'abcd');
        expect(splitRegexContentSpy).toHaveBeenCalledWith(
          'a__code_0__d',
          expect.any(Object),
        );
      });
    });
  });

  xdescribe('when line has formatting', () => {
    describe('with 2 spaces at end of line', () => {
      it('should return line break', () => {
        lineHasContentTypeSpy.mockReturnValue(false);

        const result = readLine('Some content  ');

        expect(result).toEqual([
          { type: 'text', content: 'Some content' },
          { type: 'text', format: 'line-break', content: '' },
        ]);
      });
    });

    describe.each(['*', '_'])(
      'when line has formatting using "%s"',
      (formatKey) => {
        it('should return text with formatting', () => {
          lineHasContentTypeSpy.mockReturnValue(false);
          const bold = ''.padStart(2, formatKey);
          const italic = ''.padStart(1, formatKey);
          const both = ''.padStart(3, formatKey);

          const result = readLine(
            `Some ${both}super${both} ${bold}content${bold} ${italic}here${italic}`,
          );

          const expected: Array<MarkdownType<'text'>> = [
            { type: 'text', content: 'Some ' },
            { type: 'text', format: 'bold-italic', content: 'super' },
            { type: 'text', content: ' ' },
            { type: 'text', format: 'bold', content: 'content' },
            { type: 'text', content: ' ' },
            { type: 'text', format: 'italic', content: 'here' },
          ];
          expect(result).toEqual(expected);
        });
      },
    );
  });
});
