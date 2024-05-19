import { Component, OnInit, inject } from '@angular/core';
import {
  FullPageLoaderComponent,
  PjUiRouterNavigationElement,
  RouterNavComponent,
  ThemeToggleComponent,
} from '@peterjokumsen/ui-elements';
import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { PjTheme, PjThemes } from '@peterjokumsen/ng-services';
import { Route, RouterOutlet } from '@angular/router';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { appRoutes } from './app.routes';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { pjFilterMap } from '@peterjokumsen/util-fns';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    FaIconComponent,
    NgOptimizedImage,
    RouterNavComponent,
    ThemeToggleComponent,
    FullPageLoaderComponent,
    NgTemplateOutlet,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: ``,
})
export class AppComponent implements OnInit {
  private _themeService = inject(PjTheme);
  private _currentTheme = toSignal(this._themeService.theme$);

  readonly navElements: PjUiRouterNavigationElement[] = [];
  codeIcon = faCode;
  styleLoaded = false;

  private createNavElement(route: Route): PjUiRouterNavigationElement {
    return {
      route: route.path ?? '/',
      title: route.data?.['title'] ?? '',
    };
  }

  ngOnInit() {
    const theme = this._currentTheme();
    if (theme) {
      this._themeService.setTheme(theme);
      this.styleLoaded = true;
    }

    this.navElements.push(
      ...pjFilterMap(
        appRoutes,
        (route) => route.data?.['title'],
        (route) => this.createNavElement(route),
      ),
    );
  }

  selectTheme(theme: PjThemes): void {
    if (theme === this._currentTheme()) return;
    this._themeService.setTheme(theme);
  }
}
