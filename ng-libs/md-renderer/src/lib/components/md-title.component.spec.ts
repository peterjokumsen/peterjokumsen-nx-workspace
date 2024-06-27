import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdTitleComponent } from './md-title.component';

describe('MdTitleComponent', () => {
  let component: MdTitleComponent;
  let fixture: ComponentFixture<MdTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MdTitleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MdTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
