import { TestBed } from '@angular/core/testing';
import { parseMarkdown } from '@peterjokumsen/md-parser';
import { MarkdownParserService } from './markdown-parser.service';

jest.mock('@peterjokumsen/md-parser');

describe('MarkdownParserService', () => {
  let service: MarkdownParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // keep split
        MarkdownParserService,
      ],
    });
    service = TestBed.inject(MarkdownParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('parse', () => {
    let parseMock: jest.MockedFn<typeof parseMarkdown>;

    beforeEach(() => {
      parseMock = jest
        .mocked(parseMarkdown)
        .mockName('parseMarkdown')
        .mockReturnValue({ sections: [], tags: [] });
    });

    afterEach(() => {
      parseMock.mockReset();
    });

    it('should call parseMarkdown with the markdown content', () => {
      const markdownContent = 'markdown content';

      service.parse({ markdownContent, basePath: '/assets' });

      expect(parseMock).toHaveBeenCalledWith(markdownContent);
    });

    describe('when content has relative image paths', () => {
      it.each([
        ['image.png', '/assets/doc/image.png'],
        ['./image.png', '/assets/doc/image.png'],
        ['../images/image.png', '/assets/images/image.png'],
        ['../../images/image.png', '/images/image.png'],
        ['../other-images/a-image.png', '/assets/other-images/a-image.png'],
      ])(
        'should replace "%s" with "%s" when base path is "assets/doc"',
        (original, expected) => {
          const markdownContent = `# Hello world\n\n![alt](${original})`;

          service.parse({ markdownContent, basePath: 'assets/doc' });

          expect(parseMock).toHaveBeenCalledWith(
            expect.stringContaining(`![alt](${expected})`),
          );
        },
      );
    });

    describe('when content has absolute image paths', () => {
      it('should not modify them', () => {
        const markdownContent = '![image](https://test.com/image.png)';

        service.parse({ markdownContent, basePath: '/assets' });

        expect(parseMock).toHaveBeenCalledWith(markdownContent);
      });
    });
  });
});
