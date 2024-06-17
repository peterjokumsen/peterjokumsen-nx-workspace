import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdRichContentComponent } from './md-rich-content.component';

describe('MdRichContentComponent', () => {
  let component: MdRichContentComponent;
  let fixture: ComponentFixture<MdRichContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MdRichContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MdRichContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
