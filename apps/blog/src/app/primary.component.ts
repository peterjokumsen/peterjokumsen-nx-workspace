import { Component, OnInit, inject } from '@angular/core';
import {
  FullPageLoaderComponent,
  PjUiRouterNavigationElement,
  RouterNavComponent,
} from '@peterjokumsen/ui-elements';
import { NavigationStart, Route, Router, RouterOutlet } from '@angular/router';
import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { PjBrowserTools, PjLogger } from '@peterjokumsen/ng-services';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FooterComponent } from './components/footer';
import { HeaderComponent } from './components/header';
import { childRoutes } from './app.routes';
import { filter } from 'rxjs';
import { pjFilterMap } from '@peterjokumsen/ts-utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  templateUrl: './primary.component.html',
  styles: ``,
})
export class PrimaryComponent implements OnInit {
  private _logger = inject(PjLogger, { optional: true });
  private _browserTools = inject(PjBrowserTools);
  private _router = inject(Router);

  private _navigationStart$ = this._router.events.pipe(
    filter(
      (event): event is NavigationStart => event instanceof NavigationStart,
    ),
    takeUntilDestroyed(),
  );

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
        childRoutes,
        (route) => route.data?.['title'],
        (route) => this.createNavElement(route),
      ),
    );

    this._navigationStart$.subscribe((event) => {
      this._logger?.to.log('Navigation start: ', event);
      this._browserTools.window?.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
