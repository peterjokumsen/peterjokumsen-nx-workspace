import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingIndicatorComponent } from '@peterjokumsen/loading-indicator';
import { MockComponent } from 'ng-mocks';
import { RouterModule } from '@angular/router';
import { TaskManagementComponent } from './task-management.component';
import { TasksDataService } from './services';
import { of } from 'rxjs';

describe('TaskManagementComponent', () => {
  let component: TaskManagementComponent;
  let fixture: ComponentFixture<TaskManagementComponent>;

  let tasksDataMock: jest.Mocked<TasksDataService>;

  beforeEach(async () => {
    tasksDataMock = {
      getTasks: jest.fn().mockName('getTasks'),
      getStatuses: jest
        .fn(() => of([{ value: 'value', label: 'label' }]))
        .mockName('getStatuses'),
      getContexts: jest
        .fn(() => of([{ value: 'value', label: 'label' }]))
        .mockName('getContexts'),
    } as unknown as jest.Mocked<TasksDataService>;

    await TestBed.configureTestingModule({
      imports: [TaskManagementComponent, RouterModule.forRoot([])],
    })
      .overrideComponent(TaskManagementComponent, {
        remove: {
          imports: [LoadingIndicatorComponent],
        },
        add: {
          imports: [MockComponent(LoadingIndicatorComponent)],
          providers: [
            // keep split
            { provide: TasksDataService, useValue: tasksDataMock },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TaskManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
