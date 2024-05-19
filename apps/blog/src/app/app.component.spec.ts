import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FullPageLoaderComponent,
  RouterNavComponent,
  ThemeToggleComponent,
} from '@peterjokumsen/ui-elements';

import { AppComponent } from './app.component';
import { MockComponent } from 'ng-mocks';
import { PjBrowserProviders } from '@peterjokumsen/ng-services';

describe(`[blog] - ${AppComponent.name}`, () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  let browserProviderSpy: jest.Mocked<PjBrowserProviders>;
  let windowSpy: (Partial<Window> & { document: jest.Mocked<Document> }) | null;

  beforeEach(async () => {
    windowSpy = {
      document: {
        getElementById: jest.fn(),
      },
    } as unknown as Partial<Window> & { document: jest.Mocked<Document> };

    browserProviderSpy = {
      get window() {
        return windowSpy;
      },
    } as unknown as jest.Mocked<PjBrowserProviders>;

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: PjBrowserProviders, useValue: browserProviderSpy },
      ],
    })
      .overrideComponent(AppComponent, {
        remove: {
          imports: [
            RouterNavComponent,
            ThemeToggleComponent,
            FullPageLoaderComponent,
          ],
        },
        add: {
          imports: [
            MockComponent(RouterNavComponent),
            MockComponent(ThemeToggleComponent),
            MockComponent(FullPageLoaderComponent),
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should create nav elements', () => {
    fixture.detectChanges();
    expect(component.navElements).toEqual(
      expect.arrayContaining([{ route: '', title: 'Home' }]),
    );
  });

  describe('selectTheme', () => {
    describe('when window is available', () => {
      describe('and style element is not found', () => {
        it('should not throw error', () => {
          if (!windowSpy) fail('windowSpy should be defined for test');
          windowSpy.document.getElementById.mockReturnValue(null);

          expect(() => component.selectTheme('light')).not.toThrow();
        });
      });

      describe('and style element is found', () => {
        it.each(['light', 'dark'])(
          'should change theme to "%s"',
          (theme: string) => {
            const styleElement = {
              id: 'theme-style',
            } as unknown as HTMLLinkElement;
            if (!windowSpy) fail('windowSpy should be defined for test');
            windowSpy.document.getElementById.mockReturnValue(styleElement);

            component.selectTheme(theme as 'dark' | 'light');

            expect(windowSpy.document.getElementById).toHaveBeenCalledWith(
              'theme-style',
            );
            expect(styleElement.href).toBe(`${theme}-theme.css`);
          },
        );
      });
    });

    describe('when window is not available', () => {
      it('should not throw error', () => {
        expect(() => component.selectTheme('light')).not.toThrow();
      });
    });
  });
});
