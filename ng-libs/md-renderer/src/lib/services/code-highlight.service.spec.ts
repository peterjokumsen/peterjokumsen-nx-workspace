import { CodeHighlightService } from './code-highlight.service';
import { HighlightResult } from 'highlight.js';
import { TestBed } from '@angular/core/testing';
import hljs from 'highlight.js/lib/core';

jest.mock('highlight.js/lib/core');

describe('CodeHighlightService', () => {
  let service: CodeHighlightService;
  let hljsSpy: jest.Mocked<typeof hljs>;
  let registeredLanguages: string[];

  beforeEach(() => {
    hljsSpy = jest.mocked(hljs);
    registeredLanguages = [];
    hljsSpy.registerLanguage
      .mockName('registerLanguage')
      .mockImplementation((s) => {
        registeredLanguages.push(s);
      });

    TestBed.configureTestingModule({
      providers: [CodeHighlightService],
    });

    service = TestBed.inject(CodeHighlightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it.each(['bash', 'csharp', 'javascript', 'plaintext', 'typescript', 'yaml'])(
    'should register "%s"',
    (language) => {
      expect(registeredLanguages).toContain(language);
    },
  );

  describe('highlight', () => {
    beforeEach(() => {
      hljsSpy.highlight
        .mockReturnValue({
          code: 'code',
          value: 'value',
          language: 'lang',
        } as HighlightResult)
        .mockName('highlight');
    });

    it('should use highlight.js', () => {
      const result = service.highlight('code', 'typescript');
      expect(hljsSpy.highlight).toHaveBeenCalledWith('code', {
        language: 'typescript',
      });
      expect(result.code).toEqual('code');
      expect(result.htmlCode).toEqual('value');
      expect(result.language).toEqual('lang');
    });

    describe('when unhandled language used', () => {
      it('should use plaintext as fallback', () => {
        service.highlight(['code', 'code2'], 'go');
        expect(hljsSpy.highlight).toHaveBeenCalledWith('code\ncode2', {
          language: 'plaintext',
        });
      });
    });
  });
});
