import { MarkdownContent, MarkdownType } from './markdown-content';

import { MarkdownContentType } from './markdown-content-type';
import { mdModelCheck } from './md-model-check';

describe('mdModelCheck', () => {
  const markdownContentTypes: Record<
    MarkdownContentType,
    MarkdownType<MarkdownContentType>
  > = {
    'code-block': { type: 'code-block', lines: ['code-block-content'] },
    'horizontal-rule': { type: 'horizontal-rule' },
    'ordered-list': {
      type: 'ordered-list',
      indent: 0,
      items: [{ type: 'paragraph', content: '' }],
    },
    code: { type: 'code', element: 'code-content' },
    image: { type: 'image', src: 'image-src', alt: 'image-alt' },
    link: { type: 'link', href: 'link-href', content: 'link-content' },
    list: {
      type: 'list',
      indent: 0,
      items: [{ type: 'paragraph', content: '' }],
    },
    paragraph: { type: 'paragraph', content: 'paragraph-content' },
    quote: { type: 'quote', paragraphs: [] },
    section: { type: 'section', title: 'section-title', contents: [] },
    text: { type: 'text', content: 'text-content' },
    commented: { type: 'commented', lines: [] },
  };

  it('should help narrow down the type of MarkdownContent', () => {
    const content: MarkdownContent = markdownContentTypes['code-block'];
    if (mdModelCheck('code-block', content)) {
      // content is now seen as MarkdownCodeBlock inside scope.
      expect(content.lines).toEqual(['code-block-content']);
    }
  });

  describe.each(Object.entries(markdownContentTypes))(
    'when model is "%s"',
    (type, value) => {
      let model: MarkdownContent;

      beforeEach(() => {
        model = value;
      });

      describe(`and checking for "${type}"`, () => {
        it('should return true', () => {
          expect(mdModelCheck(type as MarkdownContentType, model)).toBe(true);
        });
      });

      describe('and checking for others', () => {
        it('should return false', () => {
          const otherTypes = Object.keys(markdownContentTypes).filter(
            (t) => t !== type,
          );
          otherTypes.forEach((otherType) => {
            expect(mdModelCheck(otherType as MarkdownContentType, model)).toBe(
              false,
            );
          });
        });
      });
    },
  );
});
