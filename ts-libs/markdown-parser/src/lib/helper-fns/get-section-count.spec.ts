import { getHeaderLevel } from './';

describe('getHeaderLevel', () => {
  describe.each([
    ['# S', 1],
    ['## S', 2],
    ['## S#', 2],
    ['### S', 3],
    ['#### S', 4],
    ['##### S', 5],
    ['###### S', 6],
    ['####### S', 7],
    ['S', 0],
  ])(`when line is "%s"`, (line, expectedCount) => {
    it(`should return ${expectedCount}`, () => {
      expect(getHeaderLevel(line)).toBe(expectedCount);
    });
  });

  describe('when line starts with spaces', () => {
    it('should ignore starting spaces', () => {
      expect(getHeaderLevel('   # S')).toBe(1);
    });
  });

  describe('when line starts with character other than #', () => {
    it('should return 0', () => {
      expect(getHeaderLevel('S# #')).toBe(0);
    });
  });
});
