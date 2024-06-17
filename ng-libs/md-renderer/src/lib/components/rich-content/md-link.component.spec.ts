import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdContentService } from '../../services';
import { MdLinkComponent } from './md-link.component';

describe('MdLinkComponent', () => {
  let component: MdLinkComponent;
  let fixture: ComponentFixture<MdLinkComponent>;
  let contentSpy: Partial<jest.Mocked<MdContentService>>;

  beforeEach(async () => {
    contentSpy = {
      mapContent: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MdLinkComponent],
      providers: [
        // providers
        { provide: MdContentService, useValue: contentSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MdLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
