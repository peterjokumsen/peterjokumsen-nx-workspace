import { generateMarkdownSections } from './';
import { getSectionContentType } from '../helper-fns';
import { readList } from './read-list';
import { readSection } from './read-section';

jest.mock('../helper-fns');
jest.mock('./read-list');
jest.mock('./read-section');

describe('readMarkdownSection', () => {
  let generator: ReturnType<typeof generateMarkdownSections>;
  let getSectionContentTypeSpy: jest.MockedFunction<
    typeof getSectionContentType
  >;

  beforeEach(() => {
    getSectionContentTypeSpy = jest
      .mocked(getSectionContentType)
      .mockName('getSectionContentType');
  });

  describe('when section content type is "section"', () => {
    let readSectionSpy: jest.MockedFunction<typeof readSection>;
    const expectedLines = ['# Title', '', '## Subtitle', '', 'Paragraph'];
    const expectedIndices = [0, 2, 4];

    beforeEach(() => {
      getSectionContentTypeSpy.mockReturnValue('section');
      readSectionSpy = jest
        .mocked(readSection)
        .mockName('readSection')
        .mockImplementation((lines, i) => ({
          result: { type: 'section', title: lines[i], contents: [] },
          lastLineIndex: i,
        }));

      generator = generateMarkdownSections(expectedLines.join('\n'));
    });

    it('should check section content type for each non-empty line', () => {
      for (const idx of expectedIndices) {
        generator.next();
        expect(getSectionContentTypeSpy).toHaveBeenCalledWith(
          expectedLines[idx],
        );
      }

      if (!generator.next().done) {
        throw new Error('Generator did not finish');
      }
    });

    it('should read each non-empty line', () => {
      for (const idx of expectedIndices) {
        generator.next();
        expect(readSectionSpy).toHaveBeenCalledWith(expectedLines, idx);
      }

      expect(generator.next().done).toBe(true);
    });
  });

  describe('when section content type is "list"', () => {
    let readListSpy: jest.MockedFunction<typeof readList>;
    const expectedLines = ['- List item 1', '- List item 2', '- List item 3'];

    beforeEach(() => {
      getSectionContentTypeSpy.mockReturnValue('list');
      readListSpy = jest
        .mocked(readList)
        .mockName('readList')
        .mockImplementation(() => ({
          result: { type: 'list', indent: 0, items: [] },
          lastLineIndex: 3,
        }));

      generator = generateMarkdownSections(expectedLines.join('\n'));
    });

    it('should read list and complete', () => {
      expect(generator.next().value).toEqual(
        expect.objectContaining({ type: 'list', indent: 0, items: [] }),
      );
      expect(readListSpy).toHaveBeenCalledWith(expectedLines, 0);

      expect(generator.next().done).toBe(true);
    });

    it('should check content type', () => {
      generator.next();
      expect(getSectionContentTypeSpy).toHaveBeenCalledWith(expectedLines[0]);
    });

    it('should read each list', () => {
      let indent = 0;
      readListSpy.mockImplementation(() => ({
        result: { type: 'list', indent: indent++, items: [] },
        lastLineIndex: indent,
      }));
      generator = generateMarkdownSections(expectedLines.join('\n'));
      let result = generator.next();
      expect(readListSpy).toHaveBeenCalledWith(expectedLines, 0);
      expect(result.value).toEqual(
        expect.objectContaining({ type: 'list', indent: 0, items: [] }),
      );
      result = generator.next();
      expect(readListSpy).toHaveBeenCalledWith(expectedLines, 2);
      expect(result.value).toEqual(
        expect.objectContaining({ type: 'list', indent: 1, items: [] }),
      );
    });
  });

  describe('when section content type is "paragraph"', () => {
    it('should read paragraph and complete', () => {
      const markdown = 'Some content';
      getSectionContentTypeSpy.mockReturnValue('paragraph');

      generator = generateMarkdownSections(markdown);

      const result = generator.next();
      expect(result.value).toEqual({
        type: 'paragraph',
        content: [{ type: 'text', content: 'Some content' }],
      });
      if (!generator.next().done) {
        throw new Error('Generator did not finish');
      }
    });
  });

  describe('when section content type is not supported', () => {
    it('should throw an error', () => {
      const markdown = 'Some content';
      getSectionContentTypeSpy.mockReturnValue(
        'unsupported' as ReturnType<typeof getSectionContentType>,
      );
      expect(() => {
        generateMarkdownSections(markdown).next();
      }).toThrow(
        'Content type: "unsupported" not supported. Reading line 0 "Some content"',
      );
    });
  });
});
