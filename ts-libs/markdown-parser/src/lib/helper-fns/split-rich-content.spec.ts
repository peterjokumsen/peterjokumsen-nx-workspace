import { MatchedContent } from '../_models';
import { splitRichContent } from './split-rich-content';

describe('splitRichContent', () => {
  it('should split rich content into text and rich content', () => {
    const line = 'a __b__ c __d__ e f g c __d__ e';
    const richContentMap: { [key: string]: MatchedContent } = {
      __b__: { matched: 'abc', content: { type: 'horizontal-rule' } },
      __d__: { matched: 'def', content: { type: 'code', content: 'code' } },
    };

    const result = splitRichContent(line, richContentMap);
    expect(result).toEqual([
      { type: 'text', content: 'a ' },
      { type: 'horizontal-rule' },
      { type: 'text', content: ' c ' },
      { type: 'code', content: 'code' },
      { type: 'text', content: ' e f g c ' },
      { type: 'code', content: 'code' },
      { type: 'text', content: ' e' },
    ]);
  });

  it('should return text if no rich content is found', () => {
    const line = 'a b c d e f g c d e';
    const richContentMap: { [key: string]: MatchedContent } = {
      x: { matched: 'abc', content: { type: 'horizontal-rule' } },
      y: { matched: 'def', content: { type: 'code', content: 'code' } },
    };

    const result = splitRichContent(line, richContentMap);
    expect(result).toEqual([{ type: 'text', content: line }]);
  });

  it('should return rich content if no additional text is found', () => {
    const line = '__link0__';
    const richContentMap: { [key: string]: MatchedContent } = {
      __link0__: { matched: 'd', content: { type: 'code', content: 'code' } },
    };

    const result = splitRichContent(line, richContentMap);
    expect(result).toEqual([{ type: 'code', content: 'code' }]);
  });
});
