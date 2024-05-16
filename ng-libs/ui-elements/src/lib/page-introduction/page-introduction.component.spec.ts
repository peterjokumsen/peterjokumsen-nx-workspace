import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroductionCallToAction } from './models';
import { PageIntroductionComponent } from './page-introduction.component';

@Component({
  template: `
    <pj-ui-page-introduction
      [title]="title"
      [paragraphs]="paragraphs"
      [actions]="actions"
    ></pj-ui-page-introduction>
  `,
})
class PageIntroductionComponentTestHostComponent {
  title = 'Title';
  paragraphs = ['Hello'];
  actions: IntroductionCallToAction | IntroductionCallToAction[] | undefined;

  @ViewChild(PageIntroductionComponent)
  pageIntroductionComponent!: PageIntroductionComponent;
}

describe('PageIntroductionComponent', () => {
  let component: PageIntroductionComponent;
  let fixture: ComponentFixture<PageIntroductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageIntroductionComponent],
      declarations: [PageIntroductionComponentTestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageIntroductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('title', () => {
    it('should have a default value', () => {
      expect(component.title()).toEqual('👋 Hi there!');
    });
  });

  describe('paragraphs', () => {
    it('should default to empty array', () => {
      expect(component.paragraphs()).toEqual([]);
    });
  });

  describe('actions', () => {
    it('should default to undefined', () => {
      expect(component.actions()).toBeUndefined();
    });
  });

  describe('when rendered in a host component', () => {
    let hostFixture: ComponentFixture<PageIntroductionComponentTestHostComponent>;
    let hostComponent: PageIntroductionComponentTestHostComponent;

    beforeEach(async () => {
      hostFixture = TestBed.createComponent(
        PageIntroductionComponentTestHostComponent,
      );
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();
      await hostFixture.whenStable();
    });

    it('should be created', () => {
      expect(hostComponent?.pageIntroductionComponent).toBeTruthy();
    });

    describe('and title is set', () => {
      it('should have title', () => {
        expect(hostComponent.pageIntroductionComponent.title()).toEqual(
          'Title',
        );
      });
    });

    describe('and paragraphs is set', () => {
      beforeEach(() => {
        hostComponent.paragraphs = ['Hello', 'World'];
        hostFixture.detectChanges();
      });

      it('should set paragraphs', () => {
        expect(hostComponent.pageIntroductionComponent.paragraphs()).toEqual([
          'Hello',
          'World',
        ]);
      });

      it('should render content as paragraph elements', () => {
        const paragraphs = hostFixture.nativeElement.querySelectorAll('p');
        expect(paragraphs.length).toEqual(2);
        expect(paragraphs[0].textContent).toEqual('Hello');
        expect(paragraphs[1].textContent).toEqual('World');
      });
    });

    describe('and actions', () => {
      describe('is undefined', () => {
        it('should not render actions', () => {
          const actions =
            hostFixture.nativeElement.querySelectorAll('.actions');
          expect(actions.length).toEqual(0);
        });
      });

      describe('has', () => {
        const action: IntroductionCallToAction = {
          label: 'Go to blog',
          onClick: jest.fn(),
        };

        describe('single action', () => {
          let actionAnchor: HTMLAnchorElement;

          beforeEach(() => {
            hostComponent.actions = action;
            hostFixture.detectChanges();
            const actions =
              hostFixture.nativeElement.querySelectorAll('.actions');
            const [actionElement] = actions;
            actionAnchor = actionElement?.querySelector('a');
          });

          it('should render action as anchor', () => {
            expect(actionAnchor).toBeTruthy();
          });

          it('should use label in content', () => {
            expect(actionAnchor.textContent).toContain(action.label);
          });

          it('should use action onClick when clicked', () => {
            actionAnchor.click();
            expect(action.onClick).toHaveBeenCalledWith(expect.any(MouseEvent));
          });

          it('should default type to "primary"', () => {
            expect(actionAnchor.classList).toContain('pj-button');
            expect(actionAnchor.classList).toContain('primary');
          });
        });

        describe('multiple actions', () => {
          let actionAnchors: HTMLAnchorElement[];

          beforeEach(() => {
            hostComponent.actions = [
              action,
              { label: 'Second action', type: 'main', onClick: action.onClick },
            ];
            hostFixture.detectChanges();
            const actions =
              hostFixture.nativeElement.querySelectorAll('.actions');
            expect(actions.length).toEqual(1);
            const [actionElement] = actions;
            actionAnchors = actionElement.querySelectorAll('a');
          });

          it('should render actions', () => {
            expect(actionAnchors.length).toEqual(2);
            expect(actionAnchors[0].textContent).toContain('Go to blog');
            expect(actionAnchors[1].textContent).toContain('Second action');
          });

          it('should use action type for styling', () => {
            expect(actionAnchors[1].classList).toContain('main');
          });
        });
      });
    });
  });
});
