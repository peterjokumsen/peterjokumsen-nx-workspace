import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdUnknownComponent } from './md-unknown.component';

describe('MdStaticComponent', () => {
  let component: MdUnknownComponent;
  let fixture: ComponentFixture<MdUnknownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MdUnknownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MdUnknownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
