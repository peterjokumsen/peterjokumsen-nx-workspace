import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  IntroductionBackgroundStyle,
  IntroductionCallToAction,
} from './models';

import { PageIntroductionComponent } from './';
import { PjBrowserTools } from '@peterjokumsen/ng-services';

@Component({
  template: `
    <pj-ui-page-introduction
      [introductionTitle]="introductionTitle"
      [paragraphs]="paragraphs"
      [actions]="actions"
      [style]="style"
    >
      <p class="extra-content">Custom paragraph</p>
    </pj-ui-page-introduction>
  `,
})
class PageIntroductionComponentTestHostComponent {
  introductionTitle = 'Title';
  paragraphs = ['Hello'];
  actions: string | IntroductionCallToAction[] = [];
  style: IntroductionBackgroundStyle | undefined;

  @ViewChild(PageIntroductionComponent)
  pageIntroductionComponent!: PageIntroductionComponent;
}

describe('PageIntroductionComponent', () => {
  let component: PageIntroductionComponent;
  let fixture: ComponentFixture<PageIntroductionComponent>;
  let browserToolSpy: Partial<jest.Mocked<PjBrowserTools>>;
  let linkElement: HTMLLinkElement;

  const defaultStyle: IntroductionBackgroundStyle = {
    url: '/assets/intro_background.webp',
    size: 'cover',
    repeat: 'no-repeat',
    position: 'top',
  };

  beforeEach(async () => {
    browserToolSpy = {
      getOrCreateLinkElement: jest.fn(),
    };
    linkElement = {} as unknown as HTMLLinkElement;
    browserToolSpy.getOrCreateLinkElement?.mockReturnValue(linkElement);

    await TestBed.configureTestingModule({
      imports: [PageIntroductionComponent],
      declarations: [PageIntroductionComponentTestHostComponent],
    })
      .overrideComponent(PageIntroductionComponent, {
        set: {
          providers: [
            // keep split
            { provide: PjBrowserTools, useValue: browserToolSpy },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PageIntroductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('introductionTitle', () => {
    it('should have a default value', () => {
      expect(component.introductionTitle()).toEqual('👋 Hi there!');
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

    it('should generate link element for background image', () => {
      component.backgroundStyle();
      expect(linkElement).toEqual(
        expect.objectContaining({
          rel: 'preload',
          fetchPriority: 'high',
          as: 'image',
          href: defaultStyle.url,
        }),
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

    it('should render extra content', () => {
      const extraContent = hostFixture.nativeElement.querySelector(
        'pj-ui-page-introduction .extra-content',
      );
      expect(extraContent).toBeTruthy();
    });

    describe('and introductionTitle is set', () => {
      it('should have introductionTitle', () => {
        expect(
          hostComponent.pageIntroductionComponent.introductionTitle(),
        ).toEqual('Title');
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
        const paragraphs = hostFixture.nativeElement.querySelectorAll(
          '.introduction-content',
        );
        expect(paragraphs.length).toEqual(2);
        expect(paragraphs[0].textContent).toContain('Hello');
        expect(paragraphs[1].textContent).toContain('World');
      });
    });

    describe('and actions', () => {
      const actionsSelector = '.actions';

      describe('is undefined', () => {
        it('should not render actions', () => {
          const actions =
            hostFixture.nativeElement.querySelectorAll(actionsSelector);
          expect(actions.length).toEqual(0);
        });
      });

      describe('is set as array', () => {
        let actionAnchors: HTMLAnchorElement[];

        beforeEach(() => {
          hostComponent.actions = [
            { label: 'First action' },
            { label: 'Second action', type: 'main' },
          ];
          hostFixture.detectChanges();
          const [actionElement] =
            hostFixture.nativeElement.querySelectorAll(actionsSelector);
          actionAnchors = actionElement?.querySelectorAll('button');
        });

        it('should render actions', () => {
          expect(actionAnchors).toBeTruthy();
          expect(actionAnchors.length).toEqual(2);
        });

        it('should use default action type for styling', () => {
          expect(actionAnchors[0].textContent).toContain('First action');
          expect(actionAnchors[0].classList).toContain('mat-primary');
        });

        it('should use action type for styling', () => {
          expect(actionAnchors[1].textContent).toContain('Second action');
          expect(actionAnchors[1].classList).toContain('mat-main');
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

      describe('is set as string', () => {
        let actionAnchor: HTMLAnchorElement;

        beforeEach(() => {
          hostComponent.actions = 'Test';
          hostFixture.detectChanges();
          const [actionsElement] =
            hostFixture.nativeElement.querySelectorAll(actionsSelector);
          actionAnchor = actionsElement?.querySelector('button');
        });

        it('should render action', () => {
          expect(actionAnchor).toBeTruthy();
        });

        it('should use string as action label', () => {
          expect(actionAnchor.textContent).toContain('Test');
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

      describe('is set', () => {
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
});
