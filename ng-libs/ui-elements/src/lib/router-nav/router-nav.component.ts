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
          class="hidden rounded bg-gray-400 px-4 py-2 font-bold text-pink-600"
          [routerLink]="navElement.route"
          routerLinkActive="is-active"
          disabled
        >
          {{ navElement.title }}
        </button>
        <a
          class="inline-block rounded bg-gray-800 px-4 py-2 font-bold text-pink-600 hover:bg-gray-400 hover:text-gray-800"
          [routerLink]="navElement.route"
          routerLinkActive="is-active"
        >
          {{ navElement.title }}
        </a>
      }
    </nav>
  `,
  styles: [
    'nav { height: 100% }',
    'a.is-active { display: none }',
    'button.is-active { display: inline-block }',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouterNavComponent {
  routes = input<PjUiRouterNavigationElement[]>([]);
}
