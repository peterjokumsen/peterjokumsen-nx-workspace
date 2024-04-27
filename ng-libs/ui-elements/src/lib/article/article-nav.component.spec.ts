import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PjUiArticleNavElement, PjUiArticleSection } from './models';

import { ArticleNavComponent } from './article-nav.component';

@Component({
  template: `
    <pj-ui-article-nav
      #articleNav
      [sections]="[
        createSection('Section 1?', 'section 1 content'),
        createSection('Section 2!', 'section 2 content')
      ]"
      (navigateClick)="onNavigated($event)"
    >
      <p>navigation content</p>
    </pj-ui-article-nav>
  `,
  imports: [ArticleNavComponent],
  standalone: true,
})
class ArticleNavContainerComponent {
  navigatedSections: PjUiArticleNavElement[] = [];
  @ViewChild('articleNav') articleNav?: ArticleNavComponent;

  createSection(title: string, content: string): PjUiArticleSection {
    return { title, content };
  }

  onNavigated(section: PjUiArticleNavElement): void {
    this.navigatedSections.push(section);
  }
}

describe('ArticleNavComponent', () => {
  let container: ArticleNavContainerComponent;
  let component: ArticleNavComponent | undefined;
  let fixture: ComponentFixture<ArticleNavContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleNavComponent, ArticleNavContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleNavContainerComponent);
    container = fixture.componentInstance;
    fixture.detectChanges();
    component = container.articleNav;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map the provided sections', () => {
    expect(component.navElements()).toEqual([
      { id: 'section-1', title: 'Section 1?' },
      { id: 'section-2', title: 'Section 2!' },
    ]);
  });

  it('should display content', () => {
    const content = fixture.nativeElement.querySelector('p');
    expect(content.textContent).toBe('navigation content');
  });

  describe('navigateClick', () => {
    it('should emit the selected section', () => {
      const section = component.navElements()[0];
      component.navigateClick.emit(section);
      expect(container.navigatedSections).toEqual([section]);
    });
  });
});
