import { Component, OnInit } from '@angular/core';
import {
  FullPageLoaderComponent,
  PjUiRouterNavigationElement,
  RouterNavComponent,
} from '@peterjokumsen/ui-elements';
import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { Route, RouterOutlet } from '@angular/router';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FooterComponent } from './components/footer';
import { HeaderComponent } from './components/header';
import { appRoutes } from './app.routes';
import { pjFilterMap } from '@peterjokumsen/ts-utils';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    FaIconComponent,
    NgOptimizedImage,
    RouterNavComponent,
    FullPageLoaderComponent,
    NgTemplateOutlet,
    FooterComponent,
    HeaderComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: ``,
})
export class AppComponent implements OnInit {
  readonly navElements: PjUiRouterNavigationElement[] = [];

  private createNavElement(route: Route): PjUiRouterNavigationElement {
    return {
      route: route.path ?? '/',
      title: route.data?.['title'] ?? '',
    };
  }

  ngOnInit() {
    this.navElements.push(
      ...pjFilterMap(
        appRoutes,
        (route) => route.data?.['title'],
        (route) => this.createNavElement(route),
      ),
    );
  }
}
