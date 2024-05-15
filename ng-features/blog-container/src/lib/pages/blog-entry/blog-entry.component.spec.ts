import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleComponent } from '@peterjokumsen/ui-elements';
import { BlogEntryComponent } from './blog-entry.component';
import { MockComponent } from 'ng-mocks';

describe('BlogEntryComponent', () => {
  let component: BlogEntryComponent;
  let fixture: ComponentFixture<BlogEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogEntryComponent],
    })
      .overrideComponent(BlogEntryComponent, {
        set: {
          imports: [MockComponent(ArticleComponent)],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BlogEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
