import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdContentService } from '../services';
import { ParagraphTextComponent } from './paragraph-text.component';

describe('ParagraphTextComponent', () => {
  let component: ParagraphTextComponent;
  let fixture: ComponentFixture<ParagraphTextComponent>;
  let contentSpy: Partial<jest.Mocked<MdContentService>>;

  beforeEach(async () => {
    contentSpy = {
      mapContent: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ParagraphTextComponent],
      providers: [
        // providers
        { provide: MdContentService, useValue: contentSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ParagraphTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
