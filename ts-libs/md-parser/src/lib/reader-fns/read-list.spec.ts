import { MarkdownList } from '@peterjokumsen/ts-md-models';
import { ReadResult } from '../_models';
import { readList } from './read-list';

describe('readList', () => {
  describe('when line is not a list', () => {
    it('should throw an error', () => {
      // Arrange
      const lines = ['', 'abcd', ''];
      const start = 1;

      // Act
      const act = () => readList(lines, start);

      // Assert
      expect(act).toThrow();
    });
  });

  describe('when line has lists', () => {
    beforeEach(() => {
      jest.mock('./read-paragraph', () => ({
        readParagraph: jest.fn(([v]: string[]) => ({
          content: {
            type: 'paragraph',
            content: v,
          },
          end: 0,
        })),
      }));
    });

    it('should return a list', () => {
      // Arrange
      const lines = ['- item 1', '- item 2', '- item 3'];
      const start = 0;

      // Act
      const result = readList(lines, start);

      // Assert
      const expectedContent: MarkdownList = {
        type: 'list',
        indent: 0,
        items: [
          {
            type: 'paragraph',
            content: 'item 1',
          },
          {
            type: 'paragraph',
            content: 'item 2',
          },
          {
            type: 'paragraph',
            content: 'item 3',
          },
        ],
      };
      const expected: ReadResult<'list'> = {
        result: expectedContent,
        lastLineIndex: 3,
      };
      expect(result).toEqual(expected);
    });
  });
});
