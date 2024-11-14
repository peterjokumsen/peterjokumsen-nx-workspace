import { Observable, firstValueFrom } from 'rxjs';
import { RESPONSE_DELAY, TasksDataService } from './tasks-data.service';

import { LoadingService } from '@peterjokumsen/loading-indicator';
import { Task } from '../models';
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
        { provide: RESPONSE_DELAY, useValue: false },
        { provide: LoadingService, useValue: loadingServiceMock },
        TasksDataService,
      ],
    });
    service = TestBed.inject(TasksDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTasks', () => {
    let result$: Observable<Task[]>;

    beforeEach(() => {
      result$ = service.getTasks();
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
});
