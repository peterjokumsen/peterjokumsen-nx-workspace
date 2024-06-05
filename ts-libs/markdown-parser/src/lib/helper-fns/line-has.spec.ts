import { lineHas } from './line-has';

describe('lineHas', () => {
  let tag: Parameters<typeof lineHas>[0];

  describe(`'image'`, () => {
    beforeEach(() => {
      tag = 'image';
    });

    describe.each([
      'This is a line without an image',
      '',
      '![alt text](https://www.example.com/image.jpg',
    ])('when the line is "%s"', (line) => {
      it('should return false', () => {
        const result = lineHas(tag, line);
        expect(result).toBe(false);
      });
    });

    describe.each([
      '![alt text](https://www.example.com/image.jpg)',
      'start ![alt text](https://www.example.com/image.jpg) end',
      '[![alt text](https://www.example.com/image.jpg)](https://www.example.com)',
    ])('when the line is "%s"', (line) => {
      it('should be true', () => {
        const result = lineHas(tag, line);
        expect(result).toBe(true);
      });
    });
  });

  describe(`'link'`, () => {
    beforeEach(() => {
      tag = 'link';
    });

    describe.each(['This is a line without a link', ''])(
      'when the line is "%s"',
      (line) => {
        it('should return false', () => {
          const result = lineHas(tag, line);
          expect(result).toBe(false);
        });
      },
    );

    describe.each([
      '[alt text](https://www.example.com)',
      'start [alt text](https://www.example.com) end',
    ])('when the line is "%s"', (line) => {
      it('should be true', () => {
        const result = lineHas(tag, line);
        expect(result).toBe(true);
      });
    });
  });

  describe('when the tag does not have a Regex pattern', () => {
    it('should throw an error', () => {
      const expectedError = [
        "No search pattern for 'header'.",
        "Unable to find 'header' content in line 'line'",
      ].join(' ');
      expect(() =>
        lineHas('header' as Parameters<typeof lineHas>[0], 'line'),
      ).toThrowError(expectedError);
    });
  });
});
