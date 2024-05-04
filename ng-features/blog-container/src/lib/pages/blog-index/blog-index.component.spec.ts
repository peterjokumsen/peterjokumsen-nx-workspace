import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogIndexComponent } from './blog-index.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('BlogIndexComponent', () => {
  let component: BlogIndexComponent;
  let fixture: ComponentFixture<BlogIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogIndexComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
