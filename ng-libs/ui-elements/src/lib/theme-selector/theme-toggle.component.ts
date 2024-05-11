import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
} from '@angular/core';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ThemeProviderService } from './services/theme-provider.service';
import { Themes } from './themes.type';

@Component({
  selector: 'pj-ui-theme-toggle',
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  providers: [ThemeProviderService],
  template: `
    <button (click)="toggleTheme()" [attr.aria-label]="buttonLabel()">
      @switch (themeProvider.theme()) {
        @case ('dark') {
          <fa-icon [icon]="lightIcon"></fa-icon>
        }
        @case ('light') {
          <fa-icon [icon]="darkIcon"></fa-icon>
        }
      }
    </button>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  themeProvider = inject(ThemeProviderService);

  darkIcon = faMoon;
  lightIcon = faSun;

  buttonLabel = computed(() => {
    const currentTheme = this.themeProvider.theme();
    this.themeSelected.emit(currentTheme);

    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    return `Switch to ${nextTheme} theme`;
  });

  themeSelected = output<Themes>();

  toggleTheme() {
    const nextTheme = this.themeProvider.theme() === 'dark' ? 'light' : 'dark';
    this.themeProvider.setTheme(nextTheme);
  }
}
