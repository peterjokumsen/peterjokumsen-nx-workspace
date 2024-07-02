import { MarkdownFormatType } from '@peterjokumsen/ts-md-models';
import { matchTextFormatting } from './match-text-formatting';

describe('matchTextFormatting', () => {
  describe('when no formatting found', () => {
    it('should return empty array', () => {
      const result = matchTextFormatting('no formatting here');
      expect(result).toEqual([]);
    });
  });

  const testCases: Array<[string, MarkdownFormatType]> = [
    ['*', 'italic'],
    ['_', 'italic'],
    ['**', 'bold'],
    ['__', 'bold'],
    ['***', 'bold-italic'],
    ['___', 'bold-italic'],
    ['~~', 'strike-through'],
  ];

  it.each(testCases)('should match %s as %s', (format, expected) => {
    const result = matchTextFormatting(`${format}wrapped content${format}`);
    expect(result).toEqual([
      {
        matched: `${format}wrapped content${format}`,
        content: {
          type: 'text',
          format: expected,
          content: 'wrapped content',
        },
      },
    ]);
  });

  it.each(['*', '_'])('should match multiple formats using "%s"', (format) => {
    const result = matchTextFormatting(
      `${format}${format}bold${format}${format} and ${format}italic${format}`,
    );
    expect(result).toEqual([
      {
        matched: `${format}${format}bold${format}${format}`,
        content: {
          type: 'text',
          format: 'bold',
          content: 'bold',
        },
      },
      {
        matched: `${format}italic${format}`,
        content: {
          type: 'text',
          format: 'italic',
          content: 'italic',
        },
      },
    ]);
  });

  it('should include line-break if line ends with 2 spaces', () => {
    const result = matchTextFormatting('line ends with 2 spaces  ');
    expect(result).toEqual([
      {
        matched: '__line-break__',
        content: {
          type: 'text',
          format: 'line-break',
          content: '',
        },
      },
    ]);
  });
});
