import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComponent } from './list.component';
import { MdContentService } from '../services';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let contentSpy: Partial<jest.Mocked<MdContentService>>;

  beforeEach(async () => {
    contentSpy = {
      mapContent: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        // providers
        { provide: MdContentService, useValue: contentSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
