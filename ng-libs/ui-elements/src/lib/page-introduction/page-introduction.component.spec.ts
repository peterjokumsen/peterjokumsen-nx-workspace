import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageIntroductionComponent } from './page-introduction.component';

describe('PageIntroductionComponent', () => {
  let component: PageIntroductionComponent;
  let fixture: ComponentFixture<PageIntroductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageIntroductionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageIntroductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
