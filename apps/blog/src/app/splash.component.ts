import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NgOptimizedImage],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        style({ opacity: 1 }),
        animate('300ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
  template: `
    @defer {
      <router-outlet></router-outlet>
    } @loading (minimum 500ms) {
      <div @fadeOut class="splash">
        <img
          ngSrc="/assets/logo-150.webp"
          width="150"
          height="150"
          alt="Splash logo"
          [priority]="true"
        />
      </div>
    }
  `,
  styleUrl: './splash.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplashComponent {}
