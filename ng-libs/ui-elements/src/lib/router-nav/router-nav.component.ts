import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  FlexAlign,
  FlexDirection,
  FlexJustify,
  PjUiRouterNavigationElement,
} from './models';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MatAnchor } from '@angular/material/button';
import { ThemeToggleComponent } from '../theme-toggle';

@Component({
  selector: 'pj-ui-router-nav',
  imports: [
    CommonModule,
    RouterLinkActive,
    RouterLink,
    MatAnchor,
    ThemeToggleComponent,
  ],
  template: `
    <ng-template #titleTemplate let-nav="navElement" let-isActive="isActive">
      <span [ngClass]="{ 'font-bold': isActive }"> {{ nav.title }} </span>
    </ng-template>
    <nav
      class="flex"
      [ngClass]="{
        'items-end': flexAlign() === 'end',
        'items-center': flexAlign() === 'center',
        'flex-row': flexDirection() === 'row',
        'flex-col': flexDirection() === 'col',
        'justify-end': flexJustify() === 'end',
        'justify-center': flexJustify() === 'center',
        'justify-between': flexJustify() === 'between',
        'justify-around': flexJustify() === 'around',
        'justify-evenly': flexJustify() === 'evenly',
        'justify-start': flexJustify() === 'start',
        'gap-1': flexGap() === 1,
        'gap-2': flexGap() === 2,
        'gap-3': flexGap() === 3,
      }"
    >
      @for (navElement of routes(); track navElement.route) {
        <a
          mat-raised-button
          [color]="'primary'"
          [routerLink]="navElement.route"
          routerLinkActive="is-active"
          [routerLinkActiveOptions]="{ exact: isRootElement(navElement) }"
          ariaCurrentWhenActive="page"
          #rla="routerLinkActive"
          [disabled]="rla.isActive"
        >
          <ng-container
            [ngTemplateOutlet]="titleTemplate"
            [ngTemplateOutletContext]="{ navElement, isActive: rla.isActive }"
          ></ng-container>
        </a>
      }
      <pj-ui-theme-toggle></pj-ui-theme-toggle>
    </nav>
  `,
  styleUrl: 'router-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouterNavComponent {
  routes = input<PjUiRouterNavigationElement[]>([]);
  flexDirection = input<FlexDirection>('row');
  flexJustify = input<FlexJustify>('end');
  flexAlign = input<FlexAlign>('end');
  flexGap = input<0 | 1 | 2 | 3>(2);

  isRootElement(route: PjUiRouterNavigationElement) {
    return route.route === '/' || route.route === '';
  }
}
