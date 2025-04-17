import { Component, OnInit, inject } from '@angular/core';
import {
  ChildrenOutletContexts,
  NavigationStart,
  Route,
  Router,
  RouterOutlet,
} from '@angular/router';
import { PjBrowserTools, PjLogger } from '@peterjokumsen/ng-services';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { pjFilterMap } from '@peterjokumsen/ts-utils';
import { PjUiRouterNavigationElement } from '@peterjokumsen/ui-elements';
import { filter } from 'rxjs';
import { slideInAnimation } from './animations';
import { childRoutes } from './app.routes';
import { FooterComponent } from './components/footer';
import { HeaderComponent } from './components/header';

@Component({
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: './primary.component.html',
  styles: `
    .content {
      min-height: 100vh;
    }
  `,
  animations: [slideInAnimation('routeAnimations')],
})
export class PrimaryComponent implements OnInit {
  private _logger = inject(PjLogger, { optional: true });
  private _browserTools = inject(PjBrowserTools);
  private _router = inject(Router);
  private _contexts = inject(ChildrenOutletContexts);
  private _animations: string[] = [];

  private _navigationStart$ = this._router.events.pipe(
    filter(
      (event): event is NavigationStart => event instanceof NavigationStart,
    ),
    takeUntilDestroyed(),
  );
  loading = true;
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

  getAnimationContext() {
    const lastAnimation = this._animations.pop();
    const context = this._contexts.getContext('primary');
    const nextAnimation =
      context?.route?.snapshot?.data?.['animation'] ??
      context?.route?.snapshot?.url;
    this._animations.push(nextAnimation);
    if (!lastAnimation) return null;
    return nextAnimation;
  }
}
