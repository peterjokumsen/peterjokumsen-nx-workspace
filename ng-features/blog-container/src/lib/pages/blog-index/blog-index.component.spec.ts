import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogIndexComponent } from './blog-index.component';

describe('BlogIndexComponent', () => {
  let component: BlogIndexComponent;
  let fixture: ComponentFixture<BlogIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogIndexComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
