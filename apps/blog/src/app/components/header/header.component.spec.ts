import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockDirective } from 'ng-mocks';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from './header.component';
import { NgOptimizedImage } from '@angular/common';
import { PjBrowserTools } from '@peterjokumsen/ng-services';
import { RouterNavComponent } from '@peterjokumsen/ui-elements';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let browserToolsSpy: Partial<jest.Mocked<PjBrowserTools>>;

  beforeEach(async () => {
    browserToolsSpy = {
      window: {} as unknown as Window,
    };
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        // keep split
        { provide: PjBrowserTools, useValue: browserToolsSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(HeaderComponent, {
        set: {
          imports: [
            MockComponent(RouterNavComponent),
            MockComponent(FaIconComponent),
            MockDirective(NgOptimizedImage),
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onScroll', () => {
    it('should no throw error', () => {
      expect(() => component.onScroll()).not.toThrow();
    });
  });
});
