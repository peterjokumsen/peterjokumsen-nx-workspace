import { MarkdownQuote } from '@peterjokumsen/ts-md-models';
import { ReadResult } from '../_models';
import { readParagraph } from './read-paragraph';
import { readQuote } from './read-quote';

jest.mock('./read-paragraph');

describe('readQuote', () => {
  describe('when line is not a quote', () => {
    it('should throw an error', () => {
      // Arrange
      const lines = ['', 'abcd', ''];
      const start = 1;

      // Act
      const act = () => readQuote(lines, start);

      // Assert
      expect(act).toThrow();
    });
  });

  describe('when line has quote', () => {
    let readParagraphSpy: jest.Mocked<typeof readParagraph>;

    beforeEach(() => {
      let number = 2;
      readParagraphSpy = jest
        .mocked(readParagraph)
        .mockName('readParagraph')
        .mockImplementation(() => ({
          result: {
            type: 'paragraph',
            content: [],
          },
          lastLineIndex: number === 3 ? number + 4 : number++,
        }));
    });

    it('should return a quote with paragraphs', () => {
      // Arrange
      const lines = ['> item 1', '> item 2', '> item 3', '>', '> item 4'];
      const start = 0;

      // Act
      const result = readQuote(lines, start);

      // Assert
      const quoteLines = ['item 1', 'item 2', 'item 3', '', 'item 4'];
      expect(readParagraphSpy).toHaveBeenCalledWith(quoteLines, 0);
      expect(readParagraphSpy).toHaveBeenCalledWith(quoteLines, 4);
      const expectedContent: MarkdownQuote = {
        type: 'quote',
        indent: 0,
        paragraphs: [
          {
            type: 'paragraph',
            content: [],
          },
          {
            type: 'paragraph',
            content: [],
          },
        ],
      };
      const expected: ReadResult<'quote'> = {
        result: expectedContent,
        lastLineIndex: 5,
      };
      expect(result).toEqual(expected);
    });

    it('should handle indents of quote result', () => {
      // Arrange
      const lines = ['  > item 1', '> item 2', '> item 3', '>', '> item 4'];
      const start = 0;

      // Act
      const result = readQuote(lines, start);

      // Assert
      const quoteLines = ['item 1'];
      expect(readParagraphSpy).toHaveBeenCalledWith(quoteLines, 0);
      const expectedContent: MarkdownQuote = {
        type: 'quote',
        indent: 2,
        paragraphs: [
          {
            type: 'paragraph',
            content: [],
          },
        ],
      };
      const expected: ReadResult<'quote'> = {
        result: expectedContent,
        lastLineIndex: 1,
      };
      expect(result).toEqual(expected);
    });
  });
});
