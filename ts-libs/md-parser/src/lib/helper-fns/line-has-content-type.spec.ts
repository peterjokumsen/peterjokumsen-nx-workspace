import { lineHasContentType } from './line-has-content-type';
import { provideRegexTools } from './provide-regex-tools';

jest.mock('./provide-regex-tools');

describe('lineHasContentType', () => {
  let provideRegexToolsSpy: jest.MockedFunction<typeof provideRegexTools>;

  beforeEach(() => {
    provideRegexToolsSpy = jest
      .mocked(provideRegexTools)
      .mockName('provideRegexTools');
  });

  it('should use provideRegexTools', () => {
    provideRegexToolsSpy.mockReturnValue({
      regex: /hello world/,
      contentFn: jest.fn(),
    });
    lineHasContentType('image', 'line');
    expect(provideRegexTools).toHaveBeenCalledWith('image');
  });

  describe('when no regex in provided tools', () => {
    it('should throw an error', () => {
      provideRegexToolsSpy.mockReturnValue({
        regex: undefined as unknown as RegExp,
        contentFn: jest.fn(),
      });
      expect(() =>
        lineHasContentType(
          'header' as Parameters<typeof lineHasContentType>[0],
          'line',
        ),
      ).toThrow(
        [
          "No search pattern for 'header'.",
          "Unable to find 'header' content in line 'line'",
        ].join(' '),
      );
    });
  });
});
