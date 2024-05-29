import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MatAnchor } from '@angular/material/button';
import { PjUiRouterNavigationElement } from './models';

@Component({
  selector: 'pj-ui-router-nav',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink, MatAnchor],
  template: `
    <ng-template #titleTemplate let-nav="navElement">
      {{ nav.title }}
    </ng-template>
    <nav class="flex flex-row items-end justify-end gap-2">
      @for (navElement of routes(); track navElement.route) {
        <a
          mat-raised-button
          [color]="'primary'"
          [routerLink]="navElement.route"
          routerLinkActive="is-active"
          [routerLinkActiveOptions]="{ exact: isRootElement(navElement) }"
          #rla="routerLinkActive"
          [disabled]="rla.isActive"
        >
          <ng-container
            [ngTemplateOutlet]="titleTemplate"
            [ngTemplateOutletContext]="{ navElement }"
          ></ng-container>
        </a>
      }
    </nav>
  `,
  styleUrl: 'router-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouterNavComponent {
  routes = input<PjUiRouterNavigationElement[]>([]);

  isRootElement(route: PjUiRouterNavigationElement) {
    return route.route === '/' || route.route === '';
  }
}
