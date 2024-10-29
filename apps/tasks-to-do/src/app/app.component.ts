import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule],
  selector: 'ttd-root',
  animations: [
    trigger('fadeOut', [
      state('in', style({ opacity: 1 })),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ],
  template: ` @defer {
      <router-outlet></router-outlet>
    } @placeholder (minimum 500) {
      <div @fadeOut class="loading-container">
        <p>Loading ⌛</p>
      </div>
    }`,
  styles: `
    .loading-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      align-items: center;
      justify-content: center;
      min-height: 100svh;
      font-size: 2.5rem;
    }
  `,
})
export class AppComponent {}
