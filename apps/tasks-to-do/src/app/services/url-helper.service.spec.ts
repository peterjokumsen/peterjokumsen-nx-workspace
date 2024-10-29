import { ActivatedRouteSnapshot } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { UrlHelperService } from './url-helper.service';

describe('UrlHelperService', () => {
  let service: UrlHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
    });
    service = TestBed.inject(UrlHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const createActivatedRouterSnapshot = (
    ...paths: string[]
  ): ActivatedRouteSnapshot => {
    return {
      url: paths.map((path) => ({ path })),
    } as ActivatedRouteSnapshot;
  };

  describe('createCompleteUrl', () => {
    describe('when window.location.origin is defined', () => {
      it('should return the complete URL', () => {
        // Arrange
        const expected = 'http://localhost:9876/test';
        jest.spyOn(window, 'location', 'get').mockReturnValue({
          origin: 'http://localhost:9876',
        } as Location);
        // Act
        const result = service.createCompleteUrl(
          createActivatedRouterSnapshot('test'),
        );
        // Assert
        expect(result).toBe(expected);
      });
    });

    describe('when window.location.origin is not defined', () => {
      it('should return the complete URL', () => {
        // Arrange
        const expected = '/test';
        jest.spyOn(window, 'location', 'get').mockReturnValue({} as Location);
        // Act
        const result = service.createCompleteUrl(
          createActivatedRouterSnapshot('test'),
        );
        // Assert
        expect(result).toBe(expected);
      });
    });
  });
});
