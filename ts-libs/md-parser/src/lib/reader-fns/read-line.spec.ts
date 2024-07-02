import {
  lineHasContentType,
  mapHasContent,
  splitRegexContent,
} from '../helper-fns';

import { matchParagraphContentType } from './match-paragraph-content-type';
import { matchTextFormatting } from './match-text-formatting';
import { readLine } from './read-line';

jest.mock('../helper-fns');
jest.mock('./match-paragraph-content-type');
jest.mock('./match-text-formatting');

describe('readLine', () => {
  let lineHasContentTypeSpy: jest.MockedFunction<typeof lineHasContentType>;
  let matchParagraphContentSpy: jest.MockedFunction<
    typeof matchParagraphContentType
  >;
  let matchTextFormattingSpy: jest.MockedFunction<typeof matchTextFormatting>;
  let splitRegexContentSpy: jest.MockedFunction<typeof splitRegexContent>;

  beforeEach(() => {
    lineHasContentTypeSpy = jest
      .mocked(lineHasContentType)
      .mockName('lineHasContentType');
    matchParagraphContentSpy = jest
      .mocked(matchParagraphContentType)
      .mockName('matchParagraphContentType');
    matchTextFormattingSpy = jest
      .mocked(matchTextFormatting)
      .mockName('matchTextFormatting');
    splitRegexContentSpy = jest
      .mocked(splitRegexContent)
      .mockName('splitRegexContent');
  });

  afterEach(() => {
    lineHasContentTypeSpy.mockClear();
    matchParagraphContentSpy.mockClear();
    matchTextFormattingSpy.mockClear();
    splitRegexContentSpy.mockClear();
  });

  describe('when line has no content type or formatting', () => {
    beforeEach(() => {
      lineHasContentTypeSpy.mockReturnValue(false);
      matchTextFormattingSpy.mockReturnValue([]);
    });

    it('should return line as string', () => {
      const result = readLine('Some content');
      expect(result).toEqual([{ type: 'text', content: 'Some content' }]);
    });
  });

  describe('when line has content type(s)', () => {
    let mapHasContentSpy: jest.MockedFunction<typeof mapHasContent>;

    beforeEach(() => {
      mapHasContentSpy = jest.mocked(mapHasContent).mockName('mapHasContent');
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
              matched: 'b%%image-0%%',
              content: {
                type: 'link',
                content: '%%image-0%%',
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
          'a b%%image-0%% %%image-0%% d',
        );
        expect(matchParagraphContentSpy).toHaveBeenCalledWith(
          'link',
          'a b%%image-0%% %%image-0%% d',
        );
        expect(splitRegexContentSpy).toHaveBeenCalledWith(
          '%%image-0%%',
          expect.any(Object),
        );
        expect(splitRegexContentSpy).toHaveBeenCalledWith(
          'a %%link-0%% %%image-0%% d',
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
          'a%%link-0%%d',
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
          'a%%image-0%%d',
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
          'a%%code-0%%d',
          expect.any(Object),
        );
      });
    });
  });

  describe('when line has formatting', () => {
    beforeEach(() => {
      lineHasContentTypeSpy.mockReturnValue(false);
    });

    it('should match text formatting', () => {
      matchTextFormattingSpy.mockReturnValue([
        {
          matched: 'b',
          content: {
            type: 'text',
            format: 'bold',
            content: 'bold',
          },
        },
        {
          matched: 'c',
          content: {
            type: 'text',
            format: 'italic',
            content: 'italic',
          },
        },
      ]);

      // Act
      readLine('a b c d c b');

      expect(matchTextFormattingSpy).toHaveBeenCalledWith('a b c d c b');
      expect(splitRegexContentSpy).toHaveBeenCalledWith(
        'a %%f-0%% %%f-1%% d %%f-1%% %%f-0%%',
        expect.objectContaining({
          '%%f-0%%': expect.any(Object),
          '%%f-1%%': expect.any(Object),
        }),
      );
    });

    describe('with line-break', () => {
      it('should replace last 2 characters in line', () => {
        matchTextFormattingSpy.mockReturnValue([
          {
            matched: '%%line-break%%',
            content: {
              type: 'text',
              format: 'line-break',
              content: '',
            },
          },
        ]);

        // Act
        readLine('a b c d'); // should not have character, but ' d' used for testing purposes

        expect(splitRegexContentSpy).toHaveBeenCalledWith(
          'a b c%%f-0%%',
          expect.objectContaining({
            '%%f-0%%': expect.any(Object),
          }),
        );
      });
    });

    describe('with code', () => {
      it('should match code before matching formatting', () => {
        lineHasContentTypeSpy.mockImplementation((c) => c === 'code');
        matchParagraphContentSpy.mockReturnValue([
          { matched: '`*`', content: { type: 'code', element: '*' } },
        ]);

        // Act
        readLine('a `*` c d');

        expect(matchTextFormattingSpy).toHaveBeenCalledWith('a %%code-0%% c d');
      });
    });
  });
});
