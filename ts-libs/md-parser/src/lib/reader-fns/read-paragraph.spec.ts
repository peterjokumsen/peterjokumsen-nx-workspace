import { readLine } from './read-line';
import { readParagraph } from './read-paragraph';

jest.mock('./read-line');

describe('readParagraph', () => {
  let readLineSpy: jest.MockedFunction<typeof readLine>;

  beforeEach(() => {
    readLineSpy = jest.mocked(readLine).mockName('readLine');
  });

  afterEach(() => {
    readLineSpy.mockClear();
  });

  it('should read line provided', () => {
    const lines = ['', 'a bc c d', ''];
    readLineSpy.mockReturnValue([{ type: 'text', content: '1234' }]);

    // Act
    const { result, lastLineIndex } = readParagraph(lines, 1);

    expect(readLineSpy).toHaveBeenCalledWith('a bc c d');
    expect(lastLineIndex).toEqual(1);
    expect(result.content).toEqual([{ type: 'text', content: '1234' }]);
  });

  it('should read consecutive non-empty lines', () => {
    readLineSpy.mockImplementation((v) => [{ type: 'text', content: v }]);
    const lines = ['', 'a', 'b  ', 'c', ''];
    const start = 1;

    // Act
    const { result, lastLineIndex } = readParagraph(lines, start);

    expect(readLineSpy).toHaveBeenCalledWith('a');
    expect(readLineSpy).toHaveBeenCalledWith('b  ');
    expect(readLineSpy).toHaveBeenCalledWith('c');
    expect(lastLineIndex).toEqual(3);
    expect(result.content).toEqual([
      { type: 'text', content: 'a' },
      { type: 'text', content: 'b  ' },
      { type: 'text', content: 'c' },
    ]);
  });
});
