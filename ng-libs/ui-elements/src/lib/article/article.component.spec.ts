import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleComponent } from './article.component';
import { ArticleNavComponent } from './article-nav';
import { MockComponent } from 'ng-mocks';

describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleComponent],
    })
      .overrideComponent(ArticleComponent, {
        set: {
          imports: [MockComponent(ArticleNavComponent)],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navigateTo', () => {
    describe('when the element exists', () => {
      it('should navigate to the element', () => {
        const element = { scrollIntoView: jest.fn() };
        document.getElementById = jest.fn().mockReturnValue(element);

        component.navigateTo({ id: 'section-1', title: 'Section 1?' });

        expect(document.getElementById).toHaveBeenCalledWith('section-1');
        expect(element.scrollIntoView).toHaveBeenCalledWith({
          behavior: 'smooth',
        });
      });
    });

    describe('when the element does not exist', () => {
      it('should not navigate', () => {
        document.getElementById = jest.fn().mockReturnValue(null);

        component.navigateTo({ id: 'section-1', title: 'Section 1?' });

        expect(document.getElementById).toHaveBeenCalledWith('section-1');
      });
    });

    describe('when element has id of "#"', () => {
      it('should scroll to top', () => {
        const scrollSpy = jest
          .spyOn(window, 'scrollTo')
          .mockImplementation(() => {
            /* do nothing */
          });

        component.navigateTo({ id: '#', title: 'top' });

        expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
      });
    });
  });
});
