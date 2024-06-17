import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdContentService } from '../services';
import { OrderedListComponent } from './ordered-list.component';

describe('OrderedListComponent', () => {
  let component: OrderedListComponent;
  let fixture: ComponentFixture<OrderedListComponent>;
  let contentSpy: Partial<jest.Mocked<MdContentService>>;

  beforeEach(async () => {
    contentSpy = {
      mapContent: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [OrderedListComponent],
      providers: [
        // providers
        { provide: MdContentService, useValue: contentSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
