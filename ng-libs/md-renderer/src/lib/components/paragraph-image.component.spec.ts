import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdContentService } from '../services';
import { ParagraphImageComponent } from './paragraph-image.component';

describe('ParagraphImageComponent', () => {
  let component: ParagraphImageComponent;
  let fixture: ComponentFixture<ParagraphImageComponent>;
  let contentSpy: Partial<jest.Mocked<MdContentService>>;

  beforeEach(async () => {
    contentSpy = {
      mapContent: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ParagraphImageComponent],
      providers: [
        // providers
        { provide: MdContentService, useValue: contentSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ParagraphImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
