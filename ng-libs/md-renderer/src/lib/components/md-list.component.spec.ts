import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdContentService } from '../services';
import { MdListComponent } from './md-list.component';
import { MdWrapperComponent } from './md-wrapper.component';
import { MockComponent } from 'ng-mocks';

describe('MdListComponent', () => {
  let component: MdListComponent;
  let fixture: ComponentFixture<MdListComponent>;
  let mdContentSpy: Partial<jest.Mocked<MdContentService>>;

  beforeEach(async () => {
    mdContentSpy = {
      mapContent: jest
        .fn()
        .mockReturnValue([])
        .mockName('MdContentService.getContent'),
    };

    await TestBed.configureTestingModule({
      providers: [
        // providers
        { provide: MdContentService, useValue: mdContentSpy },
      ],
      declarations: [MockComponent(MdWrapperComponent), MdListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
