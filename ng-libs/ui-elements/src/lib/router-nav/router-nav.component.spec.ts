import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FlexAlign,
  FlexDirection,
  FlexJustify,
  PjUiRouterNavigationElement,
} from './models';

import { CommonModule } from '@angular/common';
import { MockComponent } from 'ng-mocks';
import { RouterNavComponent } from './router-nav.component';
import { ThemeToggleComponent } from '../theme-toggle';

@Component({
  imports: [RouterNavComponent],
  template: `
    <pj-ui-router-nav
      #navComponent
      [routes]="routes"
      [flexAlign]="flexAlign"
      [flexJustify]="flexJustify"
      [flexDirection]="flexDirection"
    ></pj-ui-router-nav>
  `,
  standalone: true,
})
class RouterNavHostComponent {
  @ViewChild('navComponent') navComponent!: RouterNavComponent;
  routes: PjUiRouterNavigationElement[] = [];
  flexAlign: FlexAlign = 'end';
  flexJustify: FlexJustify = 'end';
  flexDirection: FlexDirection = 'row';
}

describe('RouterNavComponent', () => {
  let hostComponent: RouterNavHostComponent;
  let fixture: ComponentFixture<RouterNavHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterNavHostComponent],
    })
      .overrideComponent(RouterNavComponent, {
        set: {
          imports: [CommonModule, MockComponent(ThemeToggleComponent)],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RouterNavHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(hostComponent.navComponent).toBeTruthy();
  });
});
