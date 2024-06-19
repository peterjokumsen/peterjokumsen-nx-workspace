import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdParagraphComponent } from './md-paragraph.component';

describe('MdParagraphComponent', () => {
  let component: MdParagraphComponent;
  let fixture: ComponentFixture<MdParagraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MdParagraphComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MdParagraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
