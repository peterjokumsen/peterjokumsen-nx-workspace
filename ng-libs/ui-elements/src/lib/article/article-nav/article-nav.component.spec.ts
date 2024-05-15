import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PjUiArticleNavElement, PjUiArticleSection } from '../models';

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
    expect(component?.navElements()).toEqual([
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
      const section = component?.navElements()[0];
      component?.navigateClick.emit(section);
      expect(container.navigatedSections).toEqual([section]);
    });
  });

  describe('when inViewId is set', () => {
    it('should add back to top element', () => {
      component?.inViewId.update(() => 'section-1');
      expect(component?.navElements()).toEqual([
        { id: '#', title: 'Back to top' },
        { id: 'section-1', title: 'Section 1?' },
        { id: 'section-2', title: 'Section 2!' },
      ]);
    });
  });

  describe('onScroll', () => {
    let foundElement: HTMLElement;
    let elementRect: DOMRect;

    beforeEach(() => {
      document.getElementById = jest
        .fn()
        .mockImplementation(() => foundElement);
    });

    it('should search for element by id', () => {
      component?.onScroll();
      expect(document.getElementById).toHaveBeenCalledWith('section-1');
      expect(document.getElementById).toHaveBeenCalledWith('section-2');
    });

    describe('when element is found', () => {
      beforeEach(() => {
        foundElement = {
          getBoundingClientRect: jest
            .fn()
            .mockImplementation(() => elementRect),
        } as unknown as HTMLElement;
      });

      describe('and element is in view', () => {
        it('should update inViewId', () => {
          elementRect = { top: 0, height: 10 } as DOMRect;
          component?.onScroll();
          expect(component?.inViewId()).toBe('section-1');
        });
      });

      describe('and all elements are below view', () => {
        it('should clear inViewId', () => {
          component?.inViewId.update(() => 'section-2');
          elementRect = { top: 10, height: 10 } as DOMRect;
          component?.onScroll();
          expect(component?.inViewId()).toEqual('');
        });
      });
    });
  });
});
