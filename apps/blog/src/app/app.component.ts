import { Component, OnInit } from '@angular/core';
import {
  PjUiRouterNavigationElement,
  RouterNavComponent,
} from '@peterjokumsen/ui-elements';
import { Route, RouterOutlet } from '@angular/router';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgOptimizedImage } from '@angular/common';
import { appRoutes } from './app.routes';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { pjFilterMap } from '@peterjokumsen/util-fns';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    FaIconComponent,
    NgOptimizedImage,
    RouterNavComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: ``,
})
export class AppComponent implements OnInit {
  readonly navElements: PjUiRouterNavigationElement[] = [];
  codeIcon = faCode;

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
