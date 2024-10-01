import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { interval, map, of, skip, tap } from 'rxjs';

import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule],
  selector: 'ttd-root',
  template: ` @defer {
      <router-outlet></router-outlet>
    } @placeholder (minimum 5000) {
      <div class="loading-container">
        <p>Loading</p>
        <div class="loading-symbols">
          @for (char of loading$ | async; track char) {
            <span>{{ char }}</span>
          }
        </div>
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
export class AppComponent {
  private _platformId = inject(PLATFORM_ID);
  private _stringValue = signal<string[]>([]);

  loading$ = !isPlatformBrowser(this._platformId)
    ? of(['⌛'])
    : interval(300).pipe(
        skip(1),
        tap((v) => {
          const next = this.fizzBuzz(v);
          console.log(this._stringValue(), next);
          this._stringValue.update((a) => [...a, next]);
        }),
        map(() => this._stringValue()),
      );

  private fizzBuzz(value: number): string {
    const mod3 = value % 3 === 0;
    const mod5 = value % 5 === 0;
    return mod3 ? (mod5 ? '🤠' : '🐮') : mod5 ? '😃' : '⌛';
  }
}
