import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WritableSignal, signal } from '@angular/core';

import { LoadingIndicatorComponent } from './loading-indicator.component';
import { LoadingService } from './loading.service';

describe('LoadingIndicatorComponent without LoadingService', () => {
  let component: LoadingIndicatorComponent;
  let fixture: ComponentFixture<LoadingIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingIndicatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingIndicatorComponent);
    component = fixture.componentInstance;
  });

  it('should throw an error', () => {
    expect(() => component.ngOnInit()).toThrow(
      expect.objectContaining({
        message: expect.stringContaining('provideLoadingIndicator'),
      }),
    );
  });
});

describe('LoadingIndicatorComponent', () => {
  let component: LoadingIndicatorComponent;
  let fixture: ComponentFixture<LoadingIndicatorComponent>;

  let isLoadingSignal: WritableSignal<boolean>;
  let loadingService: Pick<LoadingService, 'isLoading'>;

  beforeEach(async () => {
    isLoadingSignal = signal(false);
    loadingService = {
      isLoading: isLoadingSignal,
    };

    await TestBed.configureTestingModule({
      providers: [
        // keep split
        { provide: LoadingService, useValue: loadingService },
      ],
      imports: [LoadingIndicatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when isLoading is false', () => {
    beforeEach(() => {
      isLoadingSignal.update(() => false);
      fixture.detectChanges();
    });

    it('should set display to none', () => {
      expect(fixture.nativeElement.style.display).toBe('none');
    });
  });

  describe('when isLoading is true', () => {
    beforeEach(() => {
      isLoadingSignal.update(() => true);
      fixture.detectChanges();
    });

    it('should set display to block', () => {
      expect(fixture.nativeElement.style.display).toBe('block');
    });
  });
});
