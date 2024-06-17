import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdContentService } from '../services';
import { ParagraphLinkComponent } from './paragraph-link.component';

describe('ParagraphLinkComponent', () => {
  let component: ParagraphLinkComponent;
  let fixture: ComponentFixture<ParagraphLinkComponent>;
  let contentSpy: Partial<jest.Mocked<MdContentService>>;

  beforeEach(async () => {
    contentSpy = {
      mapContent: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ParagraphLinkComponent],
      providers: [
        // providers
        { provide: MdContentService, useValue: contentSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ParagraphLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
