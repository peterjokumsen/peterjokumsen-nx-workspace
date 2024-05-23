import { LogFns, PjLogger } from '../pj-logger';

import { PjArticle } from './models';
import { PjArticleParser } from './';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

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
    const useFromSource = (
      ...params: Parameters<PjArticleParser['fromSource']>
    ): Promise<PjArticle> => {
      return firstValueFrom(service.fromSource(...params));
    };

    describe('when source is string', () => {
      describe('and is markdown with titles and basic content', () => {
        let result: PjArticle;

        beforeEach(async () => {
          result = await useFromSource(`
          # Page title

          ## Section 1

          A new section.
          To show.

          ## Section 2

          Another section.
          `);
        });

        it('should set primary title', () => {
          expect(result.title).toBe('Page title');
        });

        it('should return sections', () => {
          expect(result.sections).toEqual([
            {
              title: 'Section 1',
              content: ['A new section.', 'To show.'],
            },
            {
              title: 'Section 2',
              content: ['Another section.'],
            },
          ]);
        });
      });
    });
  });
});
