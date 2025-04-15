import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  inject,
  input,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  FlexAlign,
  FlexDirection,
  FlexJustify,
  PjUiRouterNavigationElement,
} from './models';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MatAnchor, MatButton } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'pj-ui-router-nav',
  imports: [
    CommonModule,
    RouterLinkActive,
    RouterLink,
    MatAnchor,
    MatButton,
    MatMenuModule,
  ],
  template: `
    <ng-template #titleTemplate let-nav="navElement" let-isActive="isActive">
      <span [ngClass]="{ 'font-bold': isActive }"> {{ nav.title }} </span>
    </ng-template>
    <nav>
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

      <button mat-button [matMenuTriggerFor]="menu">Theme</button>
      <mat-menu #menu="matMenu">
        @for (option of themeOptions; track option.value) {
          <button mat-menu-item (click)="toggleColorScheme(option.value)">{{ option.name }}</button>
        }
      </mat-menu>
    </nav>
  `,
  styleUrl: 'router-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouterNavComponent {
  private _platformId = inject(PLATFORM_ID);
  themeOptions = [
    { value: 'light dark', name: 'Default' },
    { value: 'light', name: 'Light' },
    { value: 'dark', name: 'Dark' },
  ]
  routes = input<PjUiRouterNavigationElement[]>([]);
  flexDirection = input<FlexDirection>('row');
  flexJustify = input<FlexJustify>('end');
  flexAlign = input<FlexAlign>('end');
  flexGap = input<0 | 1 | 2 | 3>(2);

  isRootElement(route: PjUiRouterNavigationElement) {
    return route.route === '/' || route.route === '';
  }

  toggleColorScheme(value?: string) {
    if (!isPlatformBrowser(this._platformId)) return;
    const root = document.querySelector(':root') as HTMLElement;
    if (!root) return;
    root.style.colorScheme = value ?? 'light dark';
  }
}
