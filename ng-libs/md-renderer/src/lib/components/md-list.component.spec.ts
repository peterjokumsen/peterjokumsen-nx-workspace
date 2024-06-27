import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdListComponent } from './md-list.component';

describe('MdListComponent', () => {
  let component: MdListComponent;
  let fixture: ComponentFixture<MdListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MdListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
