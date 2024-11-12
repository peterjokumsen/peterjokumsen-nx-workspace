import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterModule } from '@angular/router';
import { TaskManagementComponent } from './task-management.component';
import { TasksDataService } from '../services';

describe('TaskManagementComponent', () => {
  let component: TaskManagementComponent;
  let fixture: ComponentFixture<TaskManagementComponent>;

  let tasksDataMock: jest.Mocked<TasksDataService>;

  beforeEach(async () => {
    tasksDataMock = {
      getTasks: jest.fn().mockName('getTasks'),
    } as unknown as jest.Mocked<TasksDataService>;

    await TestBed.configureTestingModule({
      imports: [TaskManagementComponent, RouterModule.forRoot([])],
    })
      .overrideComponent(TaskManagementComponent, {
        set: {
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
