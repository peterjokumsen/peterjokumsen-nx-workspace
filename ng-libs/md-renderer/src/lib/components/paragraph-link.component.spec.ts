import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParagraphLinkComponent } from './paragraph-link.component';

describe('ParagraphLinkComponent', () => {
  let component: ParagraphLinkComponent;
  let fixture: ComponentFixture<ParagraphLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParagraphLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ParagraphLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
