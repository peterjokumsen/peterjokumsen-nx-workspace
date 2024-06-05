import { MarkdownContent } from '../models';
import { lineHas } from '../helper-fns';
import { matchRichContent } from './match-rich-content';
import { readParagraph } from './read-paragraph';

jest.mock('./match-rich-content');
jest.mock('../helper-fns');

describe('readParagraph', () => {
  describe('when line is plain text', () => {
    beforeEach(() => {
      jest.mocked(lineHas).mockReturnValue(false);
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
    describe('with link and image combined', () => {
      it('should use readRichParagraph', () => {
        const lines = ['', 'a bc c d', ''];
        const lineHasSpy = jest.mocked(lineHas).mockReturnValue(true);
        const splitRichContentSpy = jest
          .mocked(matchRichContent)
          .mockReturnValue([]);
        const matchRichContentSpy = jest
          .mocked(matchRichContent)
          .mockImplementation((type) => {
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
        expect(matchRichContentSpy).toHaveBeenCalledWith(
          'link',
          'a b__image_0__ __image_0__ d',
        );
        expect(splitRichContentSpy).toHaveBeenCalledWith(
          'a __link_0__ __image_0__',
          expect.any(Object),
        );
        expect(splitRichContentSpy).toHaveBeenCalledWith(
          '__image_0__',
          expect.any(Object),
        );
      });
    });

    describe('with link wrapped by text', () => {
      it('should return expected content', () => {
        const lines = ['', 'a [text](/link) d', ''];
        const lineHasSpy = jest
          .mocked(lineHas)
          .mockImplementation((t) => t === 'link');
        const matchRichContentSpy = jest
          .mocked(matchRichContent)
          .mockReturnValue([
            {
              matched: '[text](/link)',
              content: {
                type: 'link',
                content: 'text',
                href: '/link',
              },
            },
          ]);

        // Act
        const result = readParagraph(lines, 1);

        expect(matchRichContentSpy).not.toHaveBeenCalledWith(
          'image',
          expect.any(String),
        );
        expect(lineHasSpy).toHaveBeenCalledWith('link', 'a [text](/link) d');
        expect(matchRichContentSpy).toHaveBeenCalledWith(
          'link',
          'a [text](/link) d',
        );
        const expectedContent: MarkdownContent = {
          type: 'paragraph',
          content: [
            {
              type: 'paragraph',
              content: 'a ',
            },
            {
              type: 'link',
              content: 'text',
              href: '/link',
            },
            {
              type: 'paragraph',
              content: ' d',
            },
          ],
        };
        expect(result).toEqual({
          content: expectedContent,
          nextStart: 1,
        });
      });
    });

    describe('with multiple images', () => {
      it('should return expected', () => {
        const lines = ['', '![text](/image) ![other](/image)', ''];
        const lineHasSpy = jest
          .mocked(lineHas)
          .mockImplementation((t) => t === 'image');
        const readRichContentSpy = jest
          .mocked(matchRichContent)
          .mockImplementation((t) => {
            if (t === 'image') {
              return [
                {
                  matched: '![text](/image)',
                  content: {
                    type: 'image',
                    alt: 'text',
                    src: '/image',
                  },
                },
                {
                  matched: '![other](/image)',
                  content: {
                    type: 'image',
                    alt: 'other',
                    src: '/image',
                  },
                },
              ];
            }

            return [];
          });

        // Act
        const result = readParagraph(lines, 1);

        expect(lineHasSpy).toHaveBeenCalledWith(
          'image',
          'a ![text](/image) ![other](/image) d',
        );
        expect(readRichContentSpy).toHaveBeenCalledWith(
          'image',
          'a ![text](/image) ![other](/image) d',
        );
        const expectedContent: MarkdownContent = {
          type: 'paragraph',
          content: [
            {
              type: 'image',
              alt: 'text',
              src: '/image',
            },
            {
              type: 'image',
              alt: 'other',
              src: '/image',
            },
          ],
        };
        expect(result).toEqual({
          content: expectedContent,
          nextStart: 1,
        });
      });
    });
  });
});
