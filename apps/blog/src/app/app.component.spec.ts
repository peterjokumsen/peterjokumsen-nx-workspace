import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FullPageLoaderComponent,
  RouterNavComponent,
  ThemeToggleComponent,
} from '@peterjokumsen/ui-elements';
import { PjTheme, PjThemes } from '@peterjokumsen/ng-services';

import { AppComponent } from './app.component';
import { BehaviorSubject } from 'rxjs';
import { MockComponent } from 'ng-mocks';

describe(`[blog] - ${AppComponent.name}`, () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  let themeSpy: Partial<PjTheme>;

  beforeEach(async () => {
    const themeSubject = new BehaviorSubject<PjThemes>('light');
    themeSpy = {
      theme$: themeSubject.asObservable(),
      setTheme: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        // keep split
        { provide: PjTheme, useValue: themeSpy },
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
    it('should use PjTheme service to set theme', () => {
      component.selectTheme('dark');
      expect(themeSpy.setTheme).toHaveBeenCalledWith('dark');
    });

    describe('when theme is same as current', () => {
      it('should not set theme in theme service', () => {
        component.selectTheme('light');
        expect(themeSpy.setTheme).not.toHaveBeenCalled();
      });
    });
  });
});
