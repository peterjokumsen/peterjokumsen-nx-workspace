import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

import { PjTheme } from '@peterjokumsen/ng-services';
import { RouterOutlet } from '@angular/router';
import { first } from 'rxjs';

@Component({
  standalone: true,
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
  providers: [],
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
export class SplashComponent implements OnInit {
  private _themeSvc = inject(PjTheme);

  ngOnInit() {
    this._themeSvc.theme$.pipe(first()).subscribe((theme) => {
      this._themeSvc.setTheme(theme);
    });
  }
}
