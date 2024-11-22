import { Observable, firstValueFrom } from 'rxjs';
import { OptionDetail, Task } from '../models';
import { TasksDataService, USE_DELAY } from './tasks-data.service';

import { LoadingService } from '@peterjokumsen/loading-indicator';
import { TestBed } from '@angular/core/testing';

describe('TasksDataService', () => {
  let service: TasksDataService;

  let loadingServiceMock: jest.Mocked<
    Pick<LoadingService, 'startLoading' | 'completeLoading'>
  >;

  beforeEach(() => {
    loadingServiceMock = {
      startLoading: jest.fn().mockName('startLoading'),
      completeLoading: jest.fn().mockName('completeLoading'),
    };

    TestBed.configureTestingModule({
      providers: [
        // keep split
        { provide: USE_DELAY, useValue: false },
        { provide: LoadingService, useValue: loadingServiceMock },
        TasksDataService,
      ],
    });
    service = TestBed.inject(TasksDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('tasks$', () => {
    let result$: Observable<Task[]>;

    beforeEach(() => {
      result$ = service.tasks$;
    });

    it('should return tasks', async () => {
      const tasks = await firstValueFrom(result$);
      expect(tasks).toBeTruthy();
      expect(tasks.length).toBeGreaterThan(0);
    });

    it('should start loading', () => {
      expect(loadingServiceMock.startLoading).toHaveBeenCalledTimes(1);
    });

    it('should complete loading', async () => {
      await firstValueFrom(result$);
      expect(loadingServiceMock.completeLoading).toHaveBeenCalledTimes(1);
    });
  });

  describe('statuses$', () => {
    let result$: Observable<OptionDetail[]>;

    beforeEach(() => {
      result$ = service.statuses$;
    });

    it('should return statuses', async () => {
      const statuses = await firstValueFrom(result$);
      expect(statuses).toBeTruthy();
      expect(statuses.length).toBeGreaterThan(0);
    });

    it('should start loading', () => {
      expect(loadingServiceMock.startLoading).toHaveBeenCalledTimes(1);
    });

    it('should complete loading', async () => {
      await firstValueFrom(result$);
      expect(loadingServiceMock.completeLoading).toHaveBeenCalledTimes(1);
    });
  });

  describe('contexts$', () => {
    let result$: Observable<OptionDetail[]>;

    beforeEach(() => {
      result$ = service.contexts$;
    });

    it('should return contexts', async () => {
      const contexts = await firstValueFrom(result$);
      expect(contexts).toBeTruthy();
      expect(contexts.length).toBeGreaterThan(0);
    });

    it('should start loading', () => {
      expect(loadingServiceMock.startLoading).toHaveBeenCalledTimes(1);
    });

    it('should complete loading', async () => {
      await firstValueFrom(result$);
      expect(loadingServiceMock.completeLoading).toHaveBeenCalledTimes(1);
    });
  });
});
