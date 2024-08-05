import { readCommentedBlock } from './read-commented-block';

describe('readCommentedBlock', () => {
  it('should read commented block', () => {
    const lines = ['asdf', '<!-- starting', 'ending --> other stuffs.', 'more'];

    const result = readCommentedBlock(lines, 1);

    expect(result.lastLineIndex).toEqual(2);
    expect(result.result.lines).toEqual(['starting', 'ending']);
    expect(lines).toEqual(['asdf', '', 'other stuffs.', 'more']);
  });

  it('should set line to index before to re-read current line', () => {
    const lines = ['a', 'b <!--', 'comment', '-->', 'c'];

    const result = readCommentedBlock(lines, 1);

    expect(result.result.lines).toEqual(['comment']);
    expect(result.lastLineIndex).toEqual(0);
    expect(lines).toEqual(['a', 'b ', '', '', 'c']);
  });

  it('should handle in-line comment', () => {
    const lines = ['a', 'b <!-- comment --> c', 'd'];

    const result = readCommentedBlock(lines, 1);

    expect(result.result.lines).toEqual(['comment']);
    expect(result.lastLineIndex).toEqual(0);
    expect(lines).toEqual(['a', 'b  c', 'd']);
  });
});
