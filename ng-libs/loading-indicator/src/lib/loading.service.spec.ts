import { LoadingService } from './loading.service';
import { TestBed } from '@angular/core/testing';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // keep split
        LoadingService,
      ],
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialise with isLoading as false', () => {
    expect(service.isLoading()).toBeFalsy();
  });

  describe('when startLoading is called', () => {
    beforeEach(() => {
      service.startLoading();
    });

    it('should set isLoading to true', () => {
      expect(service.isLoading()).toBeTruthy();
    });

    describe('and completeLoading is called', () => {
      beforeEach(() => {
        service.completeLoading();
      });

      it('should set isLoading to false', () => {
        expect(service.isLoading()).toBeFalsy();
      });
    });
  });

  describe('when completeLoading is called', () => {
    beforeEach(() => {
      service.completeLoading();
    });

    it('should not set isLoading to false', () => {
      expect(service.isLoading()).toBeFalsy();
    });

    describe('and startLoading is called', () => {
      beforeEach(() => {
        service.startLoading();
      });

      it('should set isLoading to true', () => {
        expect(service.isLoading()).toBeTruthy();
      });
    });
  });
});
