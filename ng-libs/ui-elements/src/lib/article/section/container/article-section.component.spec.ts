import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleSectionComponent } from './article-section.component';
import { MockPipe } from 'ng-mocks';
import { TransformArticleContentPipe } from '../../pipes';

describe('ArticleSectionComponent', () => {
  let component: ArticleSectionComponent;
  let fixture: ComponentFixture<ArticleSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleSectionComponent],
    })
      .overrideComponent(ArticleSectionComponent, {
        set: {
          imports: [MockPipe(TransformArticleContentPipe)],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ArticleSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
