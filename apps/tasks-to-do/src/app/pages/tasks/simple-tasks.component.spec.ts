import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleTasksComponent } from './simple-tasks.component';
import { TaskService } from './task.service';

describe('SimpleTasksComponent', () => {
  let component: SimpleTasksComponent;
  let fixture: ComponentFixture<SimpleTasksComponent>;

  let tasksServiceSpy: Partial<jest.Mocked<TaskService>>;

  beforeEach(async () => {
    tasksServiceSpy = {
      getTasks: jest.fn().mockName('TaskService.getTasks'),
    };

    await TestBed.configureTestingModule({
      imports: [SimpleTasksComponent],
    })
      .overrideComponent(SimpleTasksComponent, {
        set: {
          providers: [{ provide: TaskService, useValue: tasksServiceSpy }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SimpleTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
