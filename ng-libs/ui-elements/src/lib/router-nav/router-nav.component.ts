import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { CommonModule } from '@angular/common';
import { PjUiRouterNavigationElement } from './models';

@Component({
  selector: 'pj-ui-router-nav',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink],
  template: `
    <nav class="flex flex-row-reverse items-end gap-2">
      @for (navElement of routes(); track navElement.route) {
        <button
          class="pj-button hidden border-2"
          [routerLink]="navElement.route"
          routerLinkActive="is-active"
          disabled
        >
          {{ navElement.title }}
        </button>
        <a
          class="pj-button border-2"
          [routerLink]="navElement.route"
          routerLinkActive="is-active"
        >
          {{ navElement.title }}
        </a>
      }
    </nav>
  `,
  styleUrl: 'router-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouterNavComponent {
  routes = input<PjUiRouterNavigationElement[]>([]);
}
