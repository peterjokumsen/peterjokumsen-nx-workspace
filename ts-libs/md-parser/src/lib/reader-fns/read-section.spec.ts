import {
  MarkdownContentType,
  MarkdownSection,
} from '@peterjokumsen/ts-md-models';
import { getContentType, getHeaderLevel } from '../helper-fns';

import { contentReaders } from './content-readers';
import { readSection } from './read-section';

jest.mock('../helper-fns');

describe('readSection', () => {
  let getContentTypeSpy: jest.MockedFunction<typeof getContentType>;

  beforeEach(() => {
    getContentTypeSpy = jest.mocked(getContentType);
  });

  describe('when content type is "section"', () => {
    let getHeaderLevelSpy: jest.MockedFunction<typeof getHeaderLevel>;

    beforeEach(() => {
      getContentTypeSpy.mockReturnValue('section');
      getHeaderLevelSpy = jest.mocked(getHeaderLevel);
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
          content: [
            {
              type: 'section',
              title: 'SubTitle',
              content: [],
            },
          ],
        };
        expect(result.content).toEqual(expected);
        expect(result.nextStart).toBe(1);
      });
    });

    describe('and next header level is less than current', () => {
      it('should return the section', () => {
        const lines = ['# Title', '## SubTitle', '# Title2'];

        getHeaderLevelSpy.mockImplementation(() => 1);

        const result = readSection(lines, 1);

        expect(getHeaderLevelSpy).toHaveBeenCalledWith(lines[1]);
        expect(result.content).toEqual({
          type: 'section',
          title: 'SubTitle',
          content: [],
        });
        expect(result.nextStart).toBe(1);
      });
    });
  });

  describe.each<MarkdownContentType>(['code', 'list', 'quote'])(
    `when content type is "%s"`,
    (type) => {
      const originalReader = contentReaders[type];
      beforeEach(() => {
        contentReaders[type] = jest.fn().mockImplementation((_, i) => ({
          content: { type: 'paragraph', content: '' },
          nextStart: i,
        }));
      });

      afterEach(() => {
        contentReaders[type] = originalReader;
      });

      it('should use the correct reader function', () => {
        getContentTypeSpy.mockReturnValue(type);
        const lines = ['# Title', 'Some code'];
        const start = 0;

        const result = readSection(lines, start);

        const expected: MarkdownSection = {
          type: 'section',
          title: 'Title',
          content: [{ type: 'paragraph', content: '' }],
        };

        expect(result.content).toEqual(expected);
        expect(result.nextStart).toBe(lines.length - 1);
      });
    },
  );
});
