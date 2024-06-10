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
    trigger('coinFlip', [
      transition(':enter', [
        animate(
          '600ms',
          keyframes([
            style({
              transform: 'rotateY(180deg) translate(1000%, 1000%)',
              scale: 1.5,
            }),
            style({
              transform: 'rotateY(0) translate(100%, 100%)',
              scale: 1.2,
            }),
            style({
              transform: 'rotateY(180deg) translateX(10%) translateY(10%)',
              scale: 1.3,
            }),
            style({ transform: 'rotateY(0) translate(5% 5%)', scale: 1 }),
          ]),
        ),
      ]),
    ]),
  ],
  template: `
    @defer {
      <router-outlet></router-outlet>
    } @loading (minimum 650ms) {
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
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplashComponent {}
