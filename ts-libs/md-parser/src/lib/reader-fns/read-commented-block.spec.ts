import { readCommentedBlock } from './read-commented-block';

describe('readCommentedBlock', () => {
  it('should read commented block', () => {
    const lines = ['asdf', '<!-- starting', 'ending --> other stuffs.', 'more'];

    const result = readCommentedBlock(lines, 1);

    expect(result.lastLineIndex).toEqual(2);
    expect(result.result.lines).toEqual(['starting', 'ending']);
    expect(lines).toEqual(['asdf', '<!-- starting', 'other stuffs.', 'more']);
  });
});
