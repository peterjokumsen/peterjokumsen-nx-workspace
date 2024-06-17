import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParagraphTextComponent } from './paragraph-text.component';

describe('ParagraphTextComponent', () => {
  let component: ParagraphTextComponent;
  let fixture: ComponentFixture<ParagraphTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParagraphTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ParagraphTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
