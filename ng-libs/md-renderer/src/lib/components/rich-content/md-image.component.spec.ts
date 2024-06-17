import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdContentService } from '../../services';
import { MdImageComponent } from './md-image.component';

describe('MdImageComponent', () => {
  let component: MdImageComponent;
  let fixture: ComponentFixture<MdImageComponent>;
  let contentSpy: Partial<jest.Mocked<MdContentService>>;

  beforeEach(async () => {
    contentSpy = {
      mapContent: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MdImageComponent],
      providers: [
        // providers
        { provide: MdContentService, useValue: contentSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MdImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
