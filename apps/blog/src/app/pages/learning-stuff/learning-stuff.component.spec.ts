import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningStuffComponent } from './learning-stuff.component';

describe('LearningStuffComponent', () => {
  let component: LearningStuffComponent;
  let fixture: ComponentFixture<LearningStuffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningStuffComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LearningStuffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
