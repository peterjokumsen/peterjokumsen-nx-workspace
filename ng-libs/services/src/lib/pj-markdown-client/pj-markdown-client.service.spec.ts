import { firstValueFrom, of } from 'rxjs';

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
});
