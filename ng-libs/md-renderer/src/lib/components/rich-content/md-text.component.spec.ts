import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdContentService } from '../../services';
import { MdTextComponent } from './md-text.component';

describe('ParagraphTextComponent', () => {
  let component: MdTextComponent;
  let fixture: ComponentFixture<MdTextComponent>;
  let contentSpy: Partial<jest.Mocked<MdContentService>>;

  beforeEach(async () => {
    contentSpy = {
      mapContent: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MdTextComponent],
      providers: [
        // providers
        { provide: MdContentService, useValue: contentSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MdTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
