import { TestBed } from '@angular/core/testing';

import { PjMarkdownClient } from './pj-markdown-client.service';

describe('PjMarkdownClientService', () => {
  let service: PjMarkdownClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // keep split
        PjMarkdownClient,
      ],
    });
    service = TestBed.inject(PjMarkdownClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
