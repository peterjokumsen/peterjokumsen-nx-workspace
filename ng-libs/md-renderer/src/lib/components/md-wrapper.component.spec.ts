import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdWrapperComponent } from './md-wrapper.component';

describe('MdWrapperComponent', () => {
  let component: MdWrapperComponent;
  let fixture: ComponentFixture<MdWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MdWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MdWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
