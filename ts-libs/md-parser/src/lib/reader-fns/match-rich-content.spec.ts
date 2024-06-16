import { MarkdownContent, RichContentType } from '@peterjokumsen/ts-md-models';

import { matchRichContent } from './match-rich-content';

describe('readRichContent', () => {
  let type: RichContentType;

  describe("when type is 'image'", () => {
    beforeEach(() => {
      type = 'image';
    });

    describe('and content does not have image', () => {
      it('should return empty', () => {
        const result = matchRichContent(type, 'no image here');
        expect(result).toEqual([]);
      });
    });

    describe('and content has image', () => {
      it('should return resolved image', () => {
        const result = matchRichContent(
          type,
          '![alt text](https://example.com/image.jpg)',
        );

        const expectedContent: MarkdownContent = {
          type: 'image',
          alt: 'alt text',
          src: 'https://example.com/image.jpg',
        };
        expect(result).toEqual([
          {
            matched: '![alt text](https://example.com/image.jpg)',
            content: expectedContent,
          },
        ]);
      });
    });

    describe('and content has multiple images', () => {
      it('should return resolved images', () => {
        const result = matchRichContent(
          type,
          '![alt text](/image.jpg) ![alt text](/image.jpg) [![other](/image.png)](/link)',
        );

        const firstContent: MarkdownContent = {
          type: 'image',
          alt: 'alt text',
          src: '/image.jpg',
        };
        const secondContent: MarkdownContent = {
          type: 'image',
          alt: 'other',
          src: '/image.png',
        };
        expect(result).toEqual([
          {
            matched: '![alt text](/image.jpg)',
            content: firstContent,
          },
          {
            matched: '![other](/image.png)',
            content: secondContent,
          },
        ]);
      });
    });
  });

  describe("when type is 'link'", () => {
    describe('and content does not have link', () => {
      it('should return empty', () => {
        const result = matchRichContent('link', 'no link here');
        expect(result).toEqual([]);
      });
    });

    describe('and content has link', () => {
      it('should return resolved link', () => {
        const result = matchRichContent('link', '[text](https://example.com)');

        const expectedContent: MarkdownContent = {
          type: 'link',
          content: 'text',
          href: 'https://example.com',
        };
        expect(result).toEqual([
          {
            matched: '[text](https://example.com)',
            content: expectedContent,
          },
        ]);
      });
    });

    describe('and content has multiple links', () => {
      it('should return resolved links', () => {
        const result = matchRichContent(
          'link',
          '[text](/link-1) [text](/link-1) [other](/link-2)',
        );

        const firstContent: MarkdownContent = {
          type: 'link',
          content: 'text',
          href: '/link-1',
        };
        const secondContent: MarkdownContent = {
          type: 'link',
          content: 'other',
          href: '/link-2',
        };
        expect(result).toEqual([
          {
            matched: '[text](/link-1)',
            content: firstContent,
          },
          {
            matched: '[other](/link-2)',
            content: secondContent,
          },
        ]);
      });
    });
  });
});
