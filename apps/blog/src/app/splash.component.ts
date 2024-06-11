import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';

import { PrimaryComponent } from './primary.component';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NgOptimizedImage, PrimaryComponent],
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
          @coinFlip
          ngSrc="/assets/logo-150.webp"
          width="150"
          height="150"
          alt="Splash logo"
        />
      </div>
    }
  `,
  styles: `
    .splash {
      height: 110vh;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;

      @keyframes heartbeat {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.2);
        }
        100% {
          transform: scale(1);
        }
      }

      img {
        display: block;
        animation: heartbeat 500ms infinite;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplashComponent {}
