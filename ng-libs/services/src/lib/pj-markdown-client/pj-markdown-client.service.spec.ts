import { Observable, firstValueFrom, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { PjMarkdownClient } from './';
import { MarkdownParserService } from './services';

describe('PjMarkdownClientService', () => {
  let service: PjMarkdownClient;
  let httpClient: Partial<jest.Mocked<HttpClient>>;
  let markdownParserService: Partial<jest.Mocked<MarkdownParserService>>;

  beforeEach(() => {
    httpClient = {
      get: jest.fn().mockName('HttpClient.get'),
    };
    markdownParserService = {
      parse: jest.fn().mockName('MarkdownParserService.parse'),
    };
    TestBed.configureTestingModule({
      providers: [
        // keep split
        { provide: HttpClient, useValue: httpClient },
        { provide: MarkdownParserService, useValue: markdownParserService },
        PjMarkdownClient,
      ],
    });
    service = TestBed.inject(PjMarkdownClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMarkdown', () => {
    beforeEach(() => {
      httpClient?.get?.mockReturnValue(of('markdown'));
      markdownParserService?.parse?.mockReturnValue({ sections: [], tags: [] });
    });

    it('should call httpClient.get with the provided url', async () => {
      const url = '/assets/docs/test.md';

      await firstValueFrom(service.readMarkdown(url));

      expect(httpClient.get).toHaveBeenCalledWith(url, {
        responseType: 'text',
      });
    });

    it('should call markdownParserService.parse with the response', async () => {
      await firstValueFrom(service.readMarkdown('/assets/docs/readme.md'));

      expect(markdownParserService.parse).toHaveBeenCalledWith({
        markdownContent: 'markdown',
        basePath: '/assets/docs',
      });
    });

    it('should return the parsed markdown', async () => {
      const result = await firstValueFrom(
        service.readMarkdown('/assets/docs/readme.md'),
      );

      expect(result).toEqual({ sections: [], tags: [] });
    });
  });

  describe('resolveMarkdown', () => {
    it('should try [path].md first', async () => {
      httpClient?.get?.mockReturnValue(of('markdown'));
      markdownParserService?.parse?.mockReturnValue({ sections: [], tags: [] });

      const result = await firstValueFrom(service.resolveMarkdown('test'));

      expect(httpClient.get).toHaveBeenCalledWith('assets/docs/test.md', {
        responseType: 'text',
      });
      expect(result.resolvedPath).toBe('assets/docs/test.md');
    });

    it('should fallback to [path]/README.md if [path].md fails', (done) => {
      const errorResponse = new Error('404');
      const successResponse = 'readme markdown';

      httpClient.get = jest
        .fn()
        .mockReturnValueOnce(
          new Observable((subscriber) => subscriber.error(errorResponse)),
        )
        .mockReturnValueOnce(of(successResponse));

      markdownParserService?.parse?.mockReturnValue({ sections: [], tags: [] });

      service.resolveMarkdown('test').subscribe({
        next: (result) => {
          expect(httpClient.get).toHaveBeenCalledTimes(2);
          expect(httpClient.get).toHaveBeenNthCalledWith(
            1,
            'assets/docs/test.md',
            { responseType: 'text' },
          );
          expect(httpClient.get).toHaveBeenNthCalledWith(
            2,
            'assets/docs/test/README.md',
            { responseType: 'text' },
          );
          expect(result.resolvedPath).toBe('assets/docs/test/README.md');
          done();
        },
      });
    });

    it('should error if both paths fail', (done) => {
      const errorResponse = new Error('404');

      httpClient.get = jest
        .fn()
        .mockReturnValue(
          new Observable((subscriber) => subscriber.error(errorResponse)),
        );

      service.resolveMarkdown('test').subscribe({
        error: (err) => {
          expect(err).toEqual(errorResponse);
          expect(httpClient.get).toHaveBeenCalledTimes(2);
          done();
        },
      });
    });
  });
});
