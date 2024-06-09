import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PjTheme, PjThemes } from '@peterjokumsen/ng-services';

import { BehaviorSubject } from 'rxjs';
import { FooterComponent } from './';
import { MockComponent } from 'ng-mocks';
import { ThemeToggleComponent } from '@peterjokumsen/ui-elements';

describe(FooterComponent.name, () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let themeSpy: Partial<PjTheme & jest.Mocked<PjTheme>>;

  beforeEach(async () => {
    const themeSubject = new BehaviorSubject<PjThemes>('light');
    themeSpy = {
      theme$: themeSubject.asObservable(),
      setTheme: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [{ provide: PjTheme, useValue: themeSpy }],
    })
      .overrideComponent(FooterComponent, {
        set: {
          imports: [MockComponent(ThemeToggleComponent)],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set theme after init', () => {
    expect(themeSpy.setTheme).toHaveBeenCalledWith('light');
  });
});
