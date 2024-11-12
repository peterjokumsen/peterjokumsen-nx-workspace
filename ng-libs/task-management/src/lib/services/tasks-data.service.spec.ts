import { TOGGLE_RESPONSE_DELAY, TasksDataService } from './tasks-data.service';

import { TestBed } from '@angular/core/testing';

describe('TasksDataService', () => {
  let service: TasksDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // keep split
        { provide: TOGGLE_RESPONSE_DELAY, useValue: false },
        TasksDataService,
      ],
    });
    service = TestBed.inject(TasksDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTasks', () => {
    it('should return tasks', (done) => {
      service.getTasks().subscribe((tasks) => {
        expect(tasks).toBeTruthy();
        expect(tasks.length).toBeGreaterThan(0);
        done();
      });
    });
  });
});
