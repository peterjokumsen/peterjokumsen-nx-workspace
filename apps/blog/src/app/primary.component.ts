import {
  ChildrenOutletContexts,
  NavigationStart,
  Route,
  Router,
  RouterOutlet,
} from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import {
  LoadingComponent,
  PjUiRouterNavigationElement,
} from '@peterjokumsen/ui-elements';
import { PjBrowserTools, PjLogger } from '@peterjokumsen/ng-services';

import { FooterComponent } from './components/footer';
import { HeaderComponent } from './components/header';
import { childRoutes } from './app.routes';
import { filter } from 'rxjs';
import { pjFilterMap } from '@peterjokumsen/ts-utils';
import { slideInAnimation } from './animations';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent, LoadingComponent],
  templateUrl: './primary.component.html',
  styles: ``,
  animations: [slideInAnimation('routeAnimations')],
})
export class PrimaryComponent implements OnInit {
  private _logger = inject(PjLogger, { optional: true });
  private _browserTools = inject(PjBrowserTools);
  private _router = inject(Router);
  private _contexts = inject(ChildrenOutletContexts);

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
    const context = this._contexts.getContext('primary');
    this._logger?.to.log('Primary context: ', context);
    return (
      context?.route?.snapshot?.data?.['animation'] ??
      context?.route?.snapshot?.url
    );
  }
}
