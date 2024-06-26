import { getHeaderLevel, getSectionContentType } from '../helper-fns';

import { MarkdownSection } from '@peterjokumsen/ts-md-models';
import { readList } from './read-list';
import { readParagraph } from './read-paragraph';
import { readSection } from './read-section';

jest.mock('../helper-fns');
jest.mock('./read-list');
jest.mock('./read-paragraph');

describe('readSection', () => {
  let getSectionContentTypeSpy: jest.MockedFunction<
    typeof getSectionContentType
  >;

  beforeEach(() => {
    getSectionContentTypeSpy = jest
      .mocked(getSectionContentType)
      .mockName('getSectionContentType');
  });

  it('should get content type of following line', () => {
    const lines = ['# Title', 'line 2'];
    getSectionContentTypeSpy.mockImplementation(() => {
      throw new Error('catch');
    });

    try {
      readSection(lines, 0);
    } catch {
      // ignoring error
    }

    expect(getSectionContentTypeSpy).toHaveBeenCalledWith(lines[1]);
  });

  describe('when content type is "section"', () => {
    let getHeaderLevelSpy: jest.MockedFunction<typeof getHeaderLevel>;

    beforeEach(() => {
      getSectionContentTypeSpy.mockReturnValue('section');
      getHeaderLevelSpy = jest
        .mocked(getHeaderLevel)
        .mockName('getHeaderLevel');
    });

    describe('and next header level is greater than current', () => {
      it('should read the next section', () => {
        const lines = ['# Title', '## SubTitle'];
        let i = 0;

        getHeaderLevelSpy.mockImplementation(() => i++);

        const result = readSection(lines, 0);

        expect(getHeaderLevelSpy).toHaveBeenCalledWith(lines[0]);
        expect(getHeaderLevelSpy).toHaveBeenCalledWith(lines[1]);
        const expected: MarkdownSection = {
          type: 'section',
          title: 'Title',
          contents: [
            {
              type: 'section',
              title: 'SubTitle',
              contents: [],
            },
          ],
        };
        expect(result.result).toEqual(expected);
        expect(result.nextStart).toBe(1);
      });
    });

    describe('and next header level is less than current', () => {
      it('should return the section', () => {
        const lines = ['# Title', '## SubTitle', '# Title2'];

        getHeaderLevelSpy.mockImplementation(() => 1);

        const result = readSection(lines, 1);

        expect(getHeaderLevelSpy).toHaveBeenCalledWith(lines[1]);
        expect(result.result).toEqual({
          type: 'section',
          title: 'SubTitle',
          contents: [],
        });
        expect(result.nextStart).toBe(1);
      });
    });
  });

  describe('when content type is "list"', () => {
    let readListSpy: jest.MockedFunction<typeof readList>;

    beforeEach(() => {
      getSectionContentTypeSpy.mockReturnValue('list');
      readListSpy = jest.mocked(readList).mockName('readList');
    });

    it('should push readList result into "contents"', () => {
      const lines = ['# Title', '- List item'];
      readListSpy.mockReturnValue({
        result: { type: 'list', indent: 0, items: [] },
        nextStart: 1,
      });
      const result = readSection(lines, 0);

      expect(readListSpy).toHaveBeenCalledWith(lines, 1);
      expect(result).toEqual({
        result: expect.objectContaining({
          contents: [{ type: 'list', indent: 0, items: [] }],
        }),
        nextStart: 1,
      });
    });
  });

  describe('when content type is "paragraph"', () => {
    let readParagraphSpy: jest.MockedFunction<typeof readParagraph>;

    beforeEach(() => {
      getSectionContentTypeSpy.mockReturnValue('paragraph');
      readParagraphSpy = jest.mocked(readParagraph).mockName('readParagraph');
    });

    it('should push readParagraph result into "contents"', () => {
      const lines = ['# Title', 'Some content'];
      readParagraphSpy.mockReturnValue({
        result: { type: 'paragraph', content: 'Some content' },
        nextStart: 1,
      });
      const result = readSection(lines, 0);

      expect(readParagraphSpy).toHaveBeenCalledWith(lines, 1);
      expect(result).toEqual({
        result: {
          type: 'section',
          title: 'Title',
          contents: [{ type: 'paragraph', content: 'Some content' }],
        },
        nextStart: 1,
      });
    });
  });

  describe('when content type is not supported', () => {
    it('should throw an error', () => {
      const lines = ['# Title', 'Some content'];
      getSectionContentTypeSpy.mockReturnValue(
        'unsupported' as ReturnType<typeof getSectionContentType>,
      );

      expect(() => readSection(lines, 0)).toThrow(
        'Content type: "unsupported" not supported, attempting to read line 1: "Some content"',
      );
    });
  });
});
