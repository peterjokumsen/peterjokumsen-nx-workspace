import { MarkdownList, MarkdownText } from '@peterjokumsen/ts-md-models';

import { splitRegexContent } from './split-regex-content';

describe('splitRegexContent', () => {
  const matchedList: MarkdownList = { type: 'list', items: [], indent: 0 };
  const matchedText: MarkdownText = { type: 'text', content: 'hello world' };
  let matchedContentMap: Parameters<typeof splitRegexContent>[1];

  it('should return matched content from content map', () => {
    const line = 'a __b__ c __d__ e f g c __d__ e';
    const matchedContentMap = {
      __b__: {
        matched: 'abc',
        content: matchedList,
      },
      __d__: { matched: 'def', content: matchedText },
    };

    const result = splitRegexContent(line, matchedContentMap);
    expect(result).toEqual([
      { type: 'text', content: 'a ' },
      matchedList,
      { type: 'text', content: ' c ' },
      matchedText,
      { type: 'text', content: ' e f g c ' },
      matchedText,
      { type: 'text', content: ' e' },
    ]);
  });

  it('should return text if no matched content is found', () => {
    const line = 'a b c d e f g c d e';
    matchedContentMap = {
      x: {
        matched: 'abc',
        content: matchedList,
      },
      y: { matched: 'def', content: matchedText },
    };

    const result = splitRegexContent(line, matchedContentMap);
    expect(result).toEqual([{ type: 'text', content: line }]);
  });

  it('should return matched content if no additional text is found', () => {
    const line = '__link0__';
    matchedContentMap = {
      __link0__: { matched: 'd', content: matchedText },
    };

    const result = splitRegexContent(line, matchedContentMap);
    expect(result).toEqual([matchedText]);
  });
});
