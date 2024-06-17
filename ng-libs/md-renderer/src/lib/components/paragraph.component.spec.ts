import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdContentService } from '../services';
import { MdRichContentComponent } from './rich-content';
import { MockComponent } from 'ng-mocks';
import { ParagraphComponent } from './paragraph.component';

describe('ParagraphComponent', () => {
  let component: ParagraphComponent;
  let fixture: ComponentFixture<ParagraphComponent>;
  let contentSpy: Partial<jest.Mocked<MdContentService>>;

  beforeEach(async () => {
    contentSpy = {
      mapContent: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ParagraphComponent],
      providers: [
        // providers
        { provide: MdContentService, useValue: contentSpy },
      ],
    })
      .overrideComponent(ParagraphComponent, {
        set: {
          imports: [MockComponent(MdRichContentComponent)],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ParagraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
