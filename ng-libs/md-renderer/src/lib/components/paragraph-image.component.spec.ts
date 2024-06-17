import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParagraphImageComponent } from './paragraph-image.component';

describe('ParagraphImageComponent', () => {
  let component: ParagraphImageComponent;
  let fixture: ComponentFixture<ParagraphImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParagraphImageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ParagraphImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
