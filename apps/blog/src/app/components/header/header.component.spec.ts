import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  LoadingComponent,
  RouterNavComponent,
} from '@peterjokumsen/ui-elements';
import { MockComponent, MockDirective } from 'ng-mocks';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from './header.component';
import { NgOptimizedImage } from '@angular/common';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        // keep split
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(HeaderComponent, {
        set: {
          imports: [
            MockComponent(RouterNavComponent),
            MockComponent(FaIconComponent),
            MockDirective(NgOptimizedImage),
            MockComponent(LoadingComponent),
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
});
