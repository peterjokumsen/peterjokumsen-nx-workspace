import { isRichContentString, lineHas, splitRichContent } from '../helper-fns';

import { matchRichContent } from './match-rich-content';
import { readParagraph } from './read-paragraph';

jest.mock('./match-rich-content');
jest.mock('../helper-fns');

describe('readParagraph', () => {
  let lineHasSpy: jest.MockedFunction<typeof lineHas>;

  beforeEach(() => {
    lineHasSpy = jest.mocked(lineHas).mockName('lineHas');
  });

  afterEach(() => {
    lineHasSpy.mockClear();
  });

  describe('when line is plain text', () => {
    beforeEach(() => {
      lineHasSpy.mockReturnValue(false);
    });

    it('should return expected content', () => {
      const lines = ['', 'Some content', ''];
      const start = 1;

      expect(readParagraph(lines, start)).toEqual({
        content: {
          type: 'paragraph',
          content: 'Some content',
        },
        nextStart: 1,
      });
    });
  });

  describe('when line has rich content', () => {
    let isRichContentStringSpy: jest.MockedFunction<typeof isRichContentString>;
    let splitRichContentSpy: jest.MockedFunction<typeof splitRichContent>;
    let matchRichContentSpy: jest.MockedFunction<typeof matchRichContent>;

    beforeEach(() => {
      isRichContentStringSpy = jest
        .mocked(isRichContentString)
        .mockName('isRichContentString');
      splitRichContentSpy = jest
        .mocked(splitRichContent)
        .mockName('splitRichContent');
      matchRichContentSpy = jest
        .mocked(matchRichContent)
        .mockName('matchRichContent');
    });

    afterEach(() => {
      splitRichContentSpy.mockClear();
      matchRichContentSpy.mockClear();
    });

    describe('when line has link and image', () => {
      it('should replace matched with keys used', () => {
        const lines = ['', 'a bc c d', ''];
        lineHasSpy.mockReturnValue(true);
        isRichContentStringSpy.mockReturnValue(true);
        splitRichContentSpy.mockReturnValue([]);
        matchRichContentSpy.mockImplementation((type) => {
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
        const result = readParagraph(lines, 1);

        expect(lineHasSpy).toHaveBeenCalledWith('image', 'a bc c d');
        expect(matchRichContentSpy).toHaveBeenCalledWith('image', 'a bc c d');
        expect(lineHasSpy).toHaveBeenCalledWith(
          'link',
          'a b__image_0__ __image_0__ d',
        );
        expect(matchRichContentSpy).toHaveBeenCalledWith(
          'link',
          'a b__image_0__ __image_0__ d',
        );
        expect(splitRichContentSpy).toHaveBeenCalledWith(
          '__image_0__',
          expect.any(Object),
        );
        expect(splitRichContentSpy).toHaveBeenCalledWith(
          'a __link_0__ __image_0__ d',
          expect.any(Object),
        );
      });
    });

    describe('when no image found in line', () => {
      it('should not try to match image', () => {
        const lines = ['', 'abcd', ''];
        lineHasSpy.mockImplementation((t) => t === 'link');
        matchRichContentSpy.mockReturnValue([
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
        readParagraph(lines, 1);

        expect(matchRichContentSpy).not.toHaveBeenCalledWith(
          'image',
          expect.any(String),
        );
        expect(lineHasSpy).toHaveBeenCalledWith('link', 'abcd');
        expect(matchRichContentSpy).toHaveBeenCalledWith('link', 'abcd');
        expect(splitRichContentSpy).toHaveBeenCalledWith(
          'a__link_0__d',
          expect.any(Object),
        );
      });
    });

    describe('with only image', () => {
      it('should not try to match link', () => {
        const lines = ['', 'abcd', ''];
        lineHasSpy.mockImplementation((t) => t === 'image');
        matchRichContentSpy.mockReturnValue([
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
        readParagraph(lines, 1);

        expect(matchRichContentSpy).not.toHaveBeenCalledWith(
          'link',
          expect.any(String),
        );
        expect(matchRichContentSpy).toHaveBeenCalledWith('image', 'abcd');
        expect(splitRichContentSpy).toHaveBeenCalledWith(
          'a__image_0__d',
          expect.any(Object),
        );
      });
    });
  });
});
