import { LoadingService } from './loading.service';
import { TestBed } from '@angular/core/testing';
import { provideLoadingIndicator } from './provide-loading-indicator';

describe('provideLoadingIndicator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // keep split
        provideLoadingIndicator(),
      ],
    });
  });

  it('should provide LoadingService', () => {
    const loadingService = TestBed.inject(LoadingService);
    expect(loadingService).toBeTruthy();
  });
});
