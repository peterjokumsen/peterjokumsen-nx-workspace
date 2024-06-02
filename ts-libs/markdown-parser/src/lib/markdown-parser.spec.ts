import { markdownParser } from './markdown-parser';

describe('markdownParser', () => {
  it('should work', () => {
    expect(markdownParser()).toEqual('markdown-parser');
  });
});
