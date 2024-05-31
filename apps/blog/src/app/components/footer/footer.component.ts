import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  PjTheme,
  providePjBrowserTools,
  providePjTheme,
} from '@peterjokumsen/ng-services';

import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '@peterjokumsen/ui-elements';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent],
  providers: [providePjBrowserTools(), providePjTheme()],
  template: `
    <footer class="pj-footer primary-block">
      <div class="footer-top-left col-span-4 md:col-span-2"></div>
      <div class="footer-top-center col-span-4 md:col-span-1"></div>
      <div class="footer-top-right col-span-4 flex justify-end md:col-span-1">
        <pj-ui-theme-toggle />
      </div>
      <p class="col-span-4 text-center text-sm font-bold">
        © 2024 Peter Jokumsen. All rights reserved.
      </p>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
  private _theme = inject(PjTheme);
  private _currentTheme = toSignal(this._theme.theme$);

  ngOnInit() {
    const theme = this._currentTheme();
    if (theme) {
      this._theme.setTheme(theme);
    }
  }
}
