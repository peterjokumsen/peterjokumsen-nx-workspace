import { LogFns, PjLogger } from '../pj-logger';

import { TestBed } from '@angular/core/testing';
import { parseMarkdown } from '@peterjokumsen/md-parser';
import { MarkdownAst } from '@peterjokumsen/ts-md-models';
import { firstValueFrom } from 'rxjs';
import { PjArticleParser } from './';

jest.mock('@peterjokumsen/md-parser');

describe('PjArticleParserService', () => {
  let service: PjArticleParser;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // keep split
        {
          provide: PjLogger,
          useValue: jest.mocked<PjLogger>({
            get to(): LogFns {
              return jest.mocked<LogFns>({
                group: jest.fn(),
                groupEnd: jest.fn(),
                info: jest.fn(),
                log: jest.fn(),
              } as unknown as LogFns);
            },
          }),
        },
        PjArticleParser,
      ],
    });
    service = TestBed.inject(PjArticleParser);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fromSource', () => {
    let parseMarkdownSpy: jest.Mocked<typeof parseMarkdown>;

    beforeEach(() => {
      parseMarkdownSpy = jest.mocked(parseMarkdown).mockName('parseMarkdown');
    });

    const useFromSource = (
      ...params: Parameters<PjArticleParser['fromSource']>
    ): Promise<MarkdownAst> => {
      return firstValueFrom(service.fromSource(...params));
    };

    it('should use parseMarkdown', async () => {
      await useFromSource('markdown string');
      expect(parseMarkdownSpy).toHaveBeenCalledWith('markdown string');
    });
  });
});
