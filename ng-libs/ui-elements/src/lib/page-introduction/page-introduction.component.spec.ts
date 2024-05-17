import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  IntroductionBackgroundStyle,
  IntroductionCallToAction,
} from './models';

import { PageIntroductionComponent } from './';

@Component({
  template: `
    <pj-ui-page-introduction
      [title]="title"
      [paragraphs]="paragraphs"
      [actions]="actions"
      [style]="style"
    ></pj-ui-page-introduction>
  `,
})
class PageIntroductionComponentTestHostComponent {
  title = 'Title';
  paragraphs = ['Hello'];
  actions: IntroductionCallToAction[] | undefined;
  style: IntroductionBackgroundStyle | undefined;

  @ViewChild(PageIntroductionComponent)
  pageIntroductionComponent!: PageIntroductionComponent;
}

describe('PageIntroductionComponent', () => {
  let component: PageIntroductionComponent;
  let fixture: ComponentFixture<PageIntroductionComponent>;

  const defaultStyle: IntroductionBackgroundStyle = {
    url: '/assets/intro_background.webp',
    size: 'cover',
    repeat: 'no-repeat',
    position: 'top',
  };

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

  describe('styles', () => {
    it('should default to expected', () => {
      expect(component.style()).toEqual({});
    });
  });

  describe('backgroundStyle', () => {
    it('should default to original default', () => {
      expect(component.backgroundStyle()).toEqual(
        [
          `background-image:url("${defaultStyle.url}")`,
          `background-size:${defaultStyle.size}`,
          `background-repeat:${defaultStyle.repeat}`,
          `background-position:${defaultStyle.position}`,
        ].join(';'),
      );
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

      describe('is set', () => {
        let actionAnchors: HTMLAnchorElement[];

        beforeEach(() => {
          hostComponent.actions = [
            { label: 'First action' },
            { label: 'Second action', type: 'main' },
          ];
          hostFixture.detectChanges();
          const [actionElement] =
            hostFixture.nativeElement.querySelectorAll('.actions');
          actionAnchors = actionElement?.querySelectorAll('a');
        });

        it('should render actions', () => {
          expect(actionAnchors).toBeDefined();
          expect(actionAnchors.length).toEqual(2);
        });

        it('should use default action type for styling', () => {
          expect(actionAnchors[0].textContent).toContain('First action');
          expect(actionAnchors[0].classList).toContain('primary');
        });

        it('should use action type for styling', () => {
          expect(actionAnchors[1].textContent).toContain('Second action');
          expect(actionAnchors[1].classList).toContain('main');
        });

        describe('when clicked', () => {
          it('should emit action', () => {
            const spy = jest.spyOn(
              hostComponent.pageIntroductionComponent.callToAction,
              'emit',
            );
            actionAnchors[0].click();
            expect(spy).toHaveBeenCalledWith({ label: 'First action' });
          });
        });
      });
    });

    describe('and style', () => {
      describe('is undefined', () => {
        it('should have backgroundStyle as empty string', () => {
          expect(
            hostComponent.pageIntroductionComponent.backgroundStyle(),
          ).toEqual('');
        });
      });

      const customStyle: IntroductionBackgroundStyle = {
        url: 'test-url',
        size: 'contain',
        repeat: 'repeat',
        position: 'bottom',
      };

      describe('when style is set', () => {
        it('should compute expected for "backgroundStyle"', () => {
          hostComponent.style = {
            ...customStyle,
          };
          hostFixture.detectChanges();
          expect(
            hostComponent.pageIntroductionComponent.backgroundStyle(),
          ).toEqual(
            [
              'background-image:url("test-url")',
              'background-size:contain',
              'background-repeat:repeat',
              'background-position:bottom',
            ].join(';'),
          );
        });
      });

      describe.each(
        Object.entries(customStyle) as Array<
          [keyof IntroductionBackgroundStyle, string]
        >,
      )(
        'has "%s" property defined',
        (key: keyof IntroductionBackgroundStyle, value: string) => {
          it(`should use value "${value}" with defaults`, () => {
            hostComponent.style = { [key]: value };
            hostFixture.detectChanges();

            const expectedValues = {
              ...defaultStyle,
              [key]: value,
            };
            expect(
              hostComponent.pageIntroductionComponent.backgroundStyle(),
            ).toEqual(
              [
                `background-image:url("${expectedValues.url}")`,
                `background-size:${expectedValues.size}`,
                `background-repeat:${expectedValues.repeat}`,
                `background-position:${expectedValues.position}`,
              ].join(';'),
            );
          });
        },
      );
    });
  });
});
