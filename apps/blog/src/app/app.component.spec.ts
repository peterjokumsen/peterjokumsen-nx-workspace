import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FullPageLoaderComponent,
  RouterNavComponent,
  ThemeToggleComponent,
} from '@peterjokumsen/ui-elements';

import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer';
import { MockComponent } from 'ng-mocks';

describe(`[blog] - ${AppComponent.name}`, () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    })
      .overrideComponent(AppComponent, {
        remove: {
          imports: [
            RouterNavComponent,
            FooterComponent,
            FullPageLoaderComponent,
          ],
        },
        add: {
          imports: [
            MockComponent(RouterNavComponent),
            MockComponent(ThemeToggleComponent),
            MockComponent(FooterComponent),
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
});
