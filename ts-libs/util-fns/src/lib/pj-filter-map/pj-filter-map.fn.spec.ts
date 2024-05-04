import { pjFilterMap } from './pj-filter-map.fn';

describe('pjFilterMap', () => {
  describe('simple filter map to square even numbers', () => {
    let result: number[];
    let elements: number[];

    beforeEach(() => {
      elements = [1, 2, 3, 4, 5];
      result = pjFilterMap(
        elements,
        (x) => x % 2 === 0,
        (x) => x * 2,
      );
    });

    it('should not affect passed in elements', () => {
      expect(elements).toEqual([1, 2, 3, 4, 5]);
    });

    it('should filter and map correctly', () => {
      expect(result).toEqual([4, 8]);
    });
  });

  describe('filter map for objects', () => {
    let result: { name: string; over25: boolean }[];
    let elements: { name: string; age: number }[];

    beforeEach(() => {
      elements = [
        { name: 'Alice', age: 20 },
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 40 },
      ];
      result = pjFilterMap(
        elements,
        (x) => x.age > 25,
        ({ name }) => ({ name, over25: true }),
      );
    });

    it('should not affect passed in elements', () => {
      expect(elements).toEqual([
        { name: 'Alice', age: 20 },
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 40 },
      ]);
    });

    it('should filter and map correctly', () => {
      expect(result).toEqual([
        { name: 'Bob', over25: true },
        { name: 'Charlie', over25: true },
      ]);
    });
  });
});
