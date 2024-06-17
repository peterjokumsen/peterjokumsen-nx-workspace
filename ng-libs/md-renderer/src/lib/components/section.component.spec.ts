import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdContentService } from '../services';
import { SectionComponent } from './section.component';

describe('SectionComponent', () => {
  let component: SectionComponent;
  let fixture: ComponentFixture<SectionComponent>;
  let contentSpy: Partial<jest.Mocked<MdContentService>>;

  beforeEach(async () => {
    contentSpy = {
      mapContent: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SectionComponent],
      providers: [
        // providers
        { provide: MdContentService, useValue: contentSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
