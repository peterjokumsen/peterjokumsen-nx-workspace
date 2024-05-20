import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { SplitToAnchorPipe } from './split-to-anchor.pipe';
import { TestBed } from '@angular/core/testing';

describe('SplitToAnchorPipe', () => {
  let pipe: SplitToAnchorPipe;
  let domSanitizer: Partial<jest.Mocked<DomSanitizer>>;

  beforeEach(() => {
    domSanitizer = {
      sanitize: jest.fn().mockImplementation((_, v) => v),
    };

    TestBed.configureTestingModule({
      providers: [
        // keep split
        { provide: DomSanitizer, useValue: domSanitizer },
        SplitToAnchorPipe,
      ],
    });

    pipe = TestBed.inject(SplitToAnchorPipe);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    let result: string;

    describe('when value is regular string', () => {
      beforeEach(() => {
        result = pipe.transform('value');
      });

      it('should return value', () => {
        expect(pipe.transform('value')).toEqual('value');
      });

      it('should not use sanitizer', () => {
        expect(domSanitizer.sanitize).not.toHaveBeenCalled();
      });
    });

    describe('when value has link markdown', () => {
      beforeEach(() => {
        result = pipe.transform('Hello to [value](#)');
      });

      it('should return value with anchor tag', () => {
        expect(result).toEqual('Hello to <a href="#">value</a>');
      });

      it('should sanitize url', () => {
        expect(domSanitizer.sanitize).toHaveBeenCalledWith(
          SecurityContext.URL,
          '#',
        );
      });
    });
  });
});
