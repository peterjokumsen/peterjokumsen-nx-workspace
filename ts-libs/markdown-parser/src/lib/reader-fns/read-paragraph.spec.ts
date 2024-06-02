import { readParagraph } from './read-paragraph';

describe('readParagraph', () => {
  describe('when line is plain text', () => {
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
});
