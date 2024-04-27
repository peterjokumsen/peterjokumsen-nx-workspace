import { ArticleNavService } from './article-nav.service';
import { TestBed } from '@angular/core/testing';

describe('ArticleNavService', () => {
  let service: ArticleNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createId', () => {
    it.each([
      ['this-is-a-title', 'This is a title?'],
      ['this-is-a-title', 'This is a title!'],
      ['this-is-a-title', 'This is a title.'],
      ['this-is-a-title', 'This is a title'],
    ])('should create "%s" from "%s"', (expected, title) => {
      const id = service.generateId(title);
      expect(id).toBe(expected);
    });
  });
});
