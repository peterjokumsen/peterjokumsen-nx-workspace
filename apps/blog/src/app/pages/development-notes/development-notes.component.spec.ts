import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopmentNotesComponent } from './development-notes.component';

describe('DevelopmentNotesComponent', () => {
  let component: DevelopmentNotesComponent;
  let fixture: ComponentFixture<DevelopmentNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevelopmentNotesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DevelopmentNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
