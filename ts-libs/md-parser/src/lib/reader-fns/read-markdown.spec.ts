import { MarkdownContentType } from '@peterjokumsen/ts-md-models';
import { ReadContentFn } from '../_models';
import { contentReaders } from './content-readers';
import { getContentType } from '../helper-fns';
import { readMarkdown } from './';

jest.mock('../helper-fns');

describe('readMarkdown', () => {
  let getContentTypeSpy: jest.MockedFunction<typeof getContentType>;

  beforeEach(() => {
    getContentTypeSpy = jest.mocked(getContentType);
  });

  it('should call call following line after calling content reader', () => {
    getContentTypeSpy.mockReturnValue('section');
    contentReaders.section = jest.fn().mockImplementation((lines, i) => ({
      content: { type: 'paragraph', content: lines[i] },
      nextStart: i,
    }));
    const markdown = '# Title\n\n## Subtitle\n\nParagraph';

    const generator = readMarkdown(markdown);
    generator.next();
    generator.next();
    generator.next();
    expect(generator.next().done).toBe(true);
    expect(getContentTypeSpy).toHaveBeenCalledTimes(3);
    const expectedLines = ['# Title', '', '## Subtitle', '', 'Paragraph'];
    expect(contentReaders.section).toHaveBeenCalledWith(expectedLines, 0);
    expect(contentReaders.section).toHaveBeenCalledWith(expectedLines, 2);
    expect(contentReaders.section).toHaveBeenCalledWith(expectedLines, 4);
  });

  describe.each(Object.keys(contentReaders) as MarkdownContentType[])(
    'when content type is %s',
    (type) => {
      let originalFn: ReadContentFn | undefined;

      beforeEach(() => {
        originalFn = contentReaders[type];
        contentReaders[type] = jest
          .fn()
          .mockImplementation((_, i) => ({ content: { type }, nextStart: i }));
        getContentTypeSpy.mockReturnValue(type);
      });

      afterEach(() => {
        contentReaders[type] = originalFn;
      });

      it('should call the content reader', () => {
        const markdown = 'Some content';
        const generator = readMarkdown(markdown);
        const result = generator.next();
        expect(result.value).toEqual({ type });
        expect(contentReaders[type]).toHaveBeenCalledWith([markdown], 0);
      });
    },
  );

  describe('when content type is not supported', () => {
    it('should throw an error', () => {
      const markdown = 'Some content';
      getContentTypeSpy.mockReturnValue('unsupported' as MarkdownContentType);
      expect(() => {
        readMarkdown(markdown).next();
      }).toThrowError(
        'Content type: "unsupported" not supported. Line: "Some content":0',
      );
    });
  });
});
