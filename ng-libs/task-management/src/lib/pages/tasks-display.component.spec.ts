import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterModule } from '@angular/router';
import { TasksDataService } from '../services';
import { TasksDisplayComponent } from './tasks-display.component';
import { of } from 'rxjs';

describe('TasksDisplayComponent', () => {
  let component: TasksDisplayComponent;
  let fixture: ComponentFixture<TasksDisplayComponent>;

  let tasksDataMock: jest.Mocked<TasksDataService>;

  beforeEach(async () => {
    tasksDataMock = {
      getTasks: jest.fn(() => of([])).mockName('getTasks'),
    } as unknown as jest.Mocked<TasksDataService>;

    await TestBed.configureTestingModule({
      providers: [
        {
          provide: TasksDataService,
          useValue: tasksDataMock,
        },
      ],
      imports: [
        // keep split
        RouterModule.forRoot([]),
        TasksDisplayComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
