import { readCodeBlock } from './read-code-block';

describe('readCodeBlock', () => {
  it('should read a code block', () => {
    // Arrange
    const lines = ['```typescript', 'const a = 1;', '```'];
    const start = 0;
    // Act
    const result = readCodeBlock(lines, start);
    // Assert
    expect(result).toEqual({
      lastLineIndex: 2,
      result: {
        type: 'code-block',
        indent: 0,
        language: 'typescript',
        lines: ['const a = 1;'],
      },
    });
  });

  describe('when first line is not code block', () => {
    it('should throw an error', () => {
      // Arrange
      const lines = ['const a = 1;', '```typescript', 'const b = 2;', '```'];
      const start = 0;
      // Act
      const act = () => readCodeBlock(lines, start);
      // Assert
      expect(act).toThrow(
        `Invalid code block start. "const a = 1;" does not start with "\`\`\`".`,
      );
    });
  });
});
