import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
} from '@angular/core';
import { PjTheme, PjThemes } from '@peterjokumsen/ng-services';

import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatMiniFabButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pj-ui-theme-toggle',
  standalone: true,
  imports: [CommonModule, FaIconComponent, MatTooltip, MatMiniFabButton],
  template: `
    <button
      mat-mini-fab
      type="button"
      color="primary"
      [matTooltip]="buttonLabel()"
      (click)="toggleTheme()"
      [attr.aria-label]="buttonLabel()"
    >
      <fa-icon [icon]="icon"></fa-icon>
    </button>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  private _themeSvc = inject(PjTheme);
  private _currentTheme = toSignal(this._themeSvc.theme$);

  icon = faCircleHalfStroke;

  nextTheme = computed(() => {
    const currentTheme = this._currentTheme() ?? 'dark';
    this.themeSelected.emit(currentTheme);
    return currentTheme === 'dark' ? 'light' : 'dark';
  });

  nextThemeLabel = computed(() => {
    const nextTheme = this.nextTheme();
    return nextTheme === 'dark' ? 'Dark mode' : 'Light mode';
  });

  buttonLabel = computed(() => `Switch to ${this.nextThemeLabel()}`);

  // to be removed
  themeSelected = output<PjThemes>();

  toggleTheme() {
    const nextTheme = this._currentTheme() === 'dark' ? 'light' : 'dark';
    this._themeSvc.setTheme(nextTheme);
  }
}
