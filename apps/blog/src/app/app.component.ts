import { Component, OnInit, inject } from '@angular/core';
import {
  PjUiRouterNavigationElement,
  RouterNavComponent,
  ThemeToggleComponent,
  Themes,
} from '@peterjokumsen/ui-elements';
import { Route, RouterOutlet } from '@angular/router';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgOptimizedImage } from '@angular/common';
import { PjBrowserProviders } from '@peterjokumsen/ng-services';
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
    ThemeToggleComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: ``,
})
export class AppComponent implements OnInit {
  private _browserProvider = inject(PjBrowserProviders);

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

  selectTheme(theme: Themes) {
    const window = this._browserProvider.window;
    if (!window) return;

    const styleElement = window.document.getElementById(
      'theme-style',
    ) as HTMLLinkElement;
    if (!styleElement) return;

    styleElement.href = `${theme}-theme.css`;
  }
}
